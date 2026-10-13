"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { clampNonNegative, isZeroCurrency, subtractCurrency } from "@/lib/financialMath";
import { Prisma } from "@/generated/prisma/client";

export interface DeleteTransactionResult {
    success: boolean;
    id: string;
}

export async function TransactionDelete(id: string): Promise<DeleteTransactionResult> {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    if (!id || typeof id !== "string") {
        throw new Error("Invalid transaction identifier");
    }

    try {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Acquire transaction advisory lock per user to serialize concurrent operations
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tx-lock:${user.id}`}))`;

            // 2. Read transaction INSIDE transaction block under lock to prevent race conditions
            const transaction = await tx.transaction.findUnique({
                where: { id },
            });

            if (!transaction || transaction.userId !== user.id) {
                throw new Error("Transaction not found or unauthorized");
            }

            const { day, month, year } = getNormalizedHistoryDate(transaction.date);

            // 3. Delete the transaction record
            await tx.transaction.delete({
                where: { id },
            });

            // 4. Decrement or prune MonthHistory using compound unique key with safe financial math
            const monthHistoryRecord = await tx.monthHistory.findUnique({
                where: {
                    userId_day_month_year: {
                        userId: user.id,
                        day,
                        month,
                        year,
                    },
                },
            });

            if (monthHistoryRecord) {
                const updatedIncome = transaction.type === "income"
                    ? clampNonNegative(subtractCurrency(monthHistoryRecord.income, transaction.amount))
                    : monthHistoryRecord.income;

                const updatedExpense = transaction.type === "expense"
                    ? clampNonNegative(subtractCurrency(monthHistoryRecord.expense, transaction.amount))
                    : monthHistoryRecord.expense;

                const isMonthRecordZero = isZeroCurrency(updatedIncome) && isZeroCurrency(updatedExpense);

                if (isMonthRecordZero) {
                    await tx.monthHistory.delete({
                        where: {
                            userId_day_month_year: {
                                userId: user.id,
                                day,
                                month,
                                year,
                            },
                        },
                    });
                } else {
                    await tx.monthHistory.update({
                        where: {
                            userId_day_month_year: {
                                userId: user.id,
                                day,
                                month,
                                year,
                            },
                        },
                        data: {
                            income: updatedIncome,
                            expense: updatedExpense,
                        },
                    });
                }
            }

            // 5. Decrement or prune YearHistory using compound unique key with safe financial math
            const yearHistoryRecord = await tx.yearHistory.findUnique({
                where: {
                    userId_month_year: {
                        userId: user.id,
                        month,
                        year,
                    },
                },
            });

            if (yearHistoryRecord) {
                const updatedYearIncome = transaction.type === "income"
                    ? clampNonNegative(subtractCurrency(yearHistoryRecord.income, transaction.amount))
                    : yearHistoryRecord.income;

                const updatedYearExpense = transaction.type === "expense"
                    ? clampNonNegative(subtractCurrency(yearHistoryRecord.expense, transaction.amount))
                    : yearHistoryRecord.expense;

                const isYearRecordZero = isZeroCurrency(updatedYearIncome) && isZeroCurrency(updatedYearExpense);

                if (isYearRecordZero) {
                    await tx.yearHistory.delete({
                        where: {
                            userId_month_year: {
                                userId: user.id,
                                month,
                                year,
                            },
                        },
                    });
                } else {
                    await tx.yearHistory.update({
                        where: {
                            userId_month_year: {
                                userId: user.id,
                                month,
                                year,
                            },
                        },
                        data: {
                            income: updatedYearIncome,
                            expense: updatedYearExpense,
                        },
                    });
                }
            }

            return { success: true, id };
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to delete transaction";
        console.error("Error deleting transaction:", message);
        throw new Error(message);
    }
}
