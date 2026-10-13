"use server";

import prisma from "@/lib/prisma";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { roundCurrency } from "@/lib/financialMath";
import { Prisma } from "@/generated/prisma/client";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { auth } from "@/lib/auth";

export interface RecurringProcessResult {
    success: boolean;
    processedCount: number;
    transactionIds: string[];
    error?: string;
}

function calculateNextExecutionDate(currentDate: Date, frequency: string): Date {
    switch (frequency.toLowerCase()) {
        case "daily":
            return addDays(currentDate, 1);
        case "weekly":
            return addWeeks(currentDate, 1);
        case "monthly":
            return addMonths(currentDate, 1);
        case "yearly":
            return addYears(currentDate, 1);
        default:
            return addMonths(currentDate, 1);
    }
}

/**
 * Executes due recurring transactions whose nextDate <= current timestamp.
 * Atomically generates Transaction records and updates MonthHistory & YearHistory.
 *
 * @param targetUserId Optional user ID. If not provided, processes for the authenticated session.
 */
export async function ProcessDueRecurringTransactionsAction(
    targetUserId?: string
): Promise<RecurringProcessResult> {
    let effectiveUserId = targetUserId;

    if (!effectiveUserId) {
        const session = await auth();
        effectiveUserId = session?.user?.id;
    }

    if (!effectiveUserId) {
        return {
            success: false,
            processedCount: 0,
            transactionIds: [],
            error: "Unauthorized: No target user identified.",
        };
    }

    const now = new Date();

    // Query due recurring rules
    const dueRecurring = await prisma.recurringTransaction.findMany({
        where: {
            userId: effectiveUserId,
            nextDate: {
                lte: now,
            },
        },
        orderBy: {
            nextDate: "asc",
        },
    });

    if (dueRecurring.length === 0) {
        return {
            success: true,
            processedCount: 0,
            transactionIds: [],
        };
    }

    const createdIds: string[] = [];

    for (const rule of dueRecurring) {
        const safeAmount = roundCurrency(rule.amount);
        const { day, month, year, normalizedDate } = getNormalizedHistoryDate(rule.nextDate);
        const nextTargetDate = calculateNextExecutionDate(rule.nextDate, rule.frequency);

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Lock user transactions to serialize concurrent processing
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tx-lock:${rule.userId}`}))`;

            // 1. Create Transaction record
            const newTx = await tx.transaction.create({
                data: {
                    userId: rule.userId,
                    amount: safeAmount,
                    date: normalizedDate,
                    description: rule.description || `Recurring ${rule.frequency} ${rule.category}`,
                    type: rule.type,
                    category: rule.category,
                    categoryIcon: rule.categoryIcon,
                },
            });

            createdIds.push(newTx.id);

            // 2. Upsert MonthHistory
            await tx.monthHistory.upsert({
                where: {
                    userId_day_month_year: {
                        userId: rule.userId,
                        day,
                        month,
                        year,
                    },
                },
                create: {
                    userId: rule.userId,
                    day,
                    month,
                    year,
                    income: rule.type === "income" ? safeAmount : 0,
                    expense: rule.type === "expense" ? safeAmount : 0,
                },
                update: {
                    income: {
                        increment: rule.type === "income" ? safeAmount : 0,
                    },
                    expense: {
                        increment: rule.type === "expense" ? safeAmount : 0,
                    },
                },
            });

            // 3. Upsert YearHistory
            await tx.yearHistory.upsert({
                where: {
                    userId_month_year: {
                        userId: rule.userId,
                        month,
                        year,
                    },
                },
                create: {
                    userId: rule.userId,
                    month,
                    year,
                    income: rule.type === "income" ? safeAmount : 0,
                    expense: rule.type === "expense" ? safeAmount : 0,
                },
                update: {
                    income: {
                        increment: rule.type === "income" ? safeAmount : 0,
                    },
                    expense: {
                        increment: rule.type === "expense" ? safeAmount : 0,
                    },
                },
            });

            // 4. Advance nextDate
            await tx.recurringTransaction.update({
                where: {
                    id: rule.id,
                },
                data: {
                    nextDate: nextTargetDate,
                },
            });
        });
    }

    return {
        success: true,
        processedCount: createdIds.length,
        transactionIds: createdIds,
    };
}
