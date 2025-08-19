/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function TransactionDelete(id: string) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction || transaction.userId !== user.id) {
            throw new Error("Transaction not found or unauthorized");
        }

        await prisma.$transaction(async (tx: any) => {
            await tx.transaction.delete({
                where: { id },
            });

            const day = transaction.date.getDate();
            const month = transaction.date.getMonth() + 1;
            const year = transaction.date.getFullYear();

            console.log("Processing transaction:", {
                id: transaction.id,
                date: transaction.date,
                day,
                month,
                year,
                type: transaction.type,
                amount: transaction.amount
            });

            const existingMonthHistory = await tx.monthHistory.findMany({
                where: {
                    userId: user.id,
                    day,
                    month,
                    year,
                },
            });

            console.log("Found monthHistory records:", existingMonthHistory);

            if (existingMonthHistory.length > 0) {
                const monthUpdateResult = await tx.monthHistory.updateMany({
                    where: {
                        userId: user.id,
                        day,
                        month,
                        year,
                    },
                    data: {
                        ...(transaction.type === "income" && {
                            income: { decrement: transaction.amount },
                        }),
                        ...(transaction.type === "expense" && {
                            expense: { decrement: transaction.amount },
                        }),
                    },
                });

                console.log("MonthHistory update result:", monthUpdateResult);

                const monthRecords = await tx.monthHistory.findMany({
                    where: {
                        userId: user.id,
                        month,
                        year,
                    },
                });

                const allZero = monthRecords.every((r: any) => r.income === 0 && r.expense === 0);
                console.log("All month records are zero:", allZero);

                if (allZero) {
                    const deleteResult = await tx.monthHistory.deleteMany({
                        where: {
                            userId: user.id,
                            month,
                            year,
                        },
                    });
                    console.log("Deleted month history records:", deleteResult);
                }
            } else {
                console.log("No monthHistory records found to update");
            }

            const existingYearHistory = await tx.yearHistory.findMany({
                where: {
                    userId: user.id,
                    month,
                    year,
                },
            });

            console.log("Found yearHistory records:", existingYearHistory);

            if (existingYearHistory.length > 0) {
                const yearUpdateResult = await tx.yearHistory.updateMany({
                    where: {
                        userId: user.id,
                        month,
                        year,
                    },
                    data: {
                        ...(transaction.type === "income" && {
                            income: { decrement: transaction.amount },
                        }),
                        ...(transaction.type === "expense" && {
                            expense: { decrement: transaction.amount },
                        }),
                    },
                });

                console.log("YearHistory update result:", yearUpdateResult);

                const yearRecords = await tx.yearHistory.findMany({
                    where: {
                        userId: user.id,
                        year,
                    },
                });

                const allYearZero = yearRecords.every((r: any) => r.income === 0 && r.expense === 0);
                console.log("All year records are zero:", allYearZero);

                if (allYearZero) {
                    const deleteYearResult = await tx.yearHistory.deleteMany({
                        where: {
                            userId: user.id,
                            year,
                        },
                    });
                    console.log("Deleted year history records:", deleteYearResult);
                }
            } else {
                console.log("No yearHistory records found to update");
            }
        });

        console.log("Transaction deleted successfully");
        return { success: true };

    } catch (error: any) {
        console.error("Error deleting transaction:", error);
        throw new Error(`Failed to delete transaction: ${error.message}`);
    }
}