/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getNormalizedHistoryDate } from "@/lib/dateHelper"

export async function TransactionDelete(id: string) {
    const session = await auth()
    const user = session?.user

    if (!user) {
        redirect("/sign-in")
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        })

        if (!transaction || transaction.userId !== user.id) {
            throw new Error("Transaction not found or unauthorized")
        }

        const { day, month, year } = getNormalizedHistoryDate(transaction.date)

        await prisma.$transaction(async (tx: any) => {
            // Acquire transaction advisory lock per user to serialize concurrent operations
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tx-lock:${user.id}`}))`;

            // 1. Delete the transaction record
            await tx.transaction.delete({
                where: { id },
            })

            // 2. Decrement or prune MonthHistory using compound unique key
            const monthHistoryRecord = await tx.monthHistory.findUnique({
                where: {
                    userId_day_month_year: {
                        userId: user.id,
                        day,
                        month,
                        year,
                    },
                },
            })

            if (monthHistoryRecord) {
                const updatedIncome = transaction.type === "income"
                    ? Math.max(0, monthHistoryRecord.income - transaction.amount)
                    : monthHistoryRecord.income
                const updatedExpense = transaction.type === "expense"
                    ? Math.max(0, monthHistoryRecord.expense - transaction.amount)
                    : monthHistoryRecord.expense

                const isMonthRecordZero = updatedIncome <= 0.0001 && updatedExpense <= 0.0001

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
                    })
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
                    })
                }
            }

            // 3. Decrement or prune YearHistory using compound unique key
            const yearHistoryRecord = await tx.yearHistory.findUnique({
                where: {
                    userId_month_year: {
                        userId: user.id,
                        month,
                        year,
                    },
                },
            })

            if (yearHistoryRecord) {
                const updatedYearIncome = transaction.type === "income"
                    ? Math.max(0, yearHistoryRecord.income - transaction.amount)
                    : yearHistoryRecord.income
                const updatedYearExpense = transaction.type === "expense"
                    ? Math.max(0, yearHistoryRecord.expense - transaction.amount)
                    : yearHistoryRecord.expense

                const isYearRecordZero = updatedYearIncome <= 0.0001 && updatedYearExpense <= 0.0001

                if (isYearRecordZero) {
                    await tx.yearHistory.delete({
                        where: {
                            userId_month_year: {
                                userId: user.id,
                                month,
                                year,
                            },
                        },
                    })
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
                    })
                }
            }
        })

        return { success: true }
    } catch (error: any) {
        console.error("Error deleting transaction:", error)
        throw new Error(error.message || "Failed to delete transaction")
    }
}
