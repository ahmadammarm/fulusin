"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { addCurrency, roundCurrency } from "@/lib/financialMath";
import { Prisma } from "@/generated/prisma/client";

export interface BulkImportResult {
    success: boolean;
    count?: number;
    error?: string;
}

interface AggregatedPeriod {
    income: number;
    expense: number;
    day?: number;
    month: number;
    year: number;
}

export async function BulkCreateTransactionsAction(
    transactions: CreateTransactionSchemaType[]
): Promise<BulkImportResult> {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        return { success: false, error: "Unauthorized. Please sign in again." };
    }

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return { success: false, error: "No transactions provided for import." };
    }

    // 1. Validate all inputs
    const parsedTransactions: CreateTransactionSchemaType[] = [];
    for (let i = 0; i < transactions.length; i++) {
        const item = transactions[i];
        const parsed = CreateTransactionSchema.safeParse(item);
        if (!parsed.success) {
            return {
                success: false,
                error: `Row #${i + 1} (${item.description || "Unnamed"}): ${parsed.error.issues[0]?.message || "Invalid format"}`,
            };
        }
        parsedTransactions.push(parsed.data);
    }

    // 2. Fetch all user categories to validate mapping in O(1)
    const userCategories = await prisma.category.findMany({
        where: { userId: user.id },
    });

    const categoryMap = new Map(
        userCategories.map((c) => [`${c.name.toLowerCase()}-${c.type}`, c])
    );

    const transactionsToInsert: {
        userId: string;
        amount: number;
        date: Date;
        description: string;
        type: string;
        category: string;
        categoryIcon: string;
    }[] = [];

    const monthAggregations: Record<string, AggregatedPeriod> = {};
    const dayAggregations: Record<string, AggregatedPeriod> = {};

    // 3. Process transactions and aggregate history using safe financial arithmetic
    for (const t of parsedTransactions) {
        const catKey = `${t.category.toLowerCase()}-${t.type}`;
        const categoryRow = categoryMap.get(catKey);

        if (!categoryRow) {
            return {
                success: false,
                error: `Category "${t.category}" (${t.type}) does not exist. Please create it first in preferences.`,
            };
        }

        const safeAmount = roundCurrency(t.amount);
        if (safeAmount <= 0) {
            return {
                success: false,
                error: `Invalid amount ${t.amount} for "${t.description}". Amount must be positive.`,
            };
        }

        const { day, month, year, normalizedDate } = getNormalizedHistoryDate(t.date);

        transactionsToInsert.push({
            userId: user.id,
            amount: safeAmount,
            date: normalizedDate,
            description: t.description?.trim() || "",
            type: t.type,
            category: categoryRow.name,
            categoryIcon: categoryRow.icon,
        });

        // Monthly key
        const monthKey = `${year}-${month}`;
        if (!monthAggregations[monthKey]) {
            monthAggregations[monthKey] = { income: 0, expense: 0, month, year };
        }
        if (t.type === "income") {
            monthAggregations[monthKey].income = addCurrency(monthAggregations[monthKey].income, safeAmount);
        } else {
            monthAggregations[monthKey].expense = addCurrency(monthAggregations[monthKey].expense, safeAmount);
        }

        // Daily key
        const dayKey = `${year}-${month}-${day}`;
        if (!dayAggregations[dayKey]) {
            dayAggregations[dayKey] = { income: 0, expense: 0, day, month, year };
        }
        if (t.type === "income") {
            dayAggregations[dayKey].income = addCurrency(dayAggregations[dayKey].income, safeAmount);
        } else {
            dayAggregations[dayKey].expense = addCurrency(dayAggregations[dayKey].expense, safeAmount);
        }
    }

    // 4. Execute atomic transaction with advisory lock
    try {
        await prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
                // Acquire transaction advisory lock per user to serialize concurrent operations
                await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tx-lock:${user.id}`}))`;

                // 4a. Bulk insert transactions
                await tx.transaction.createMany({
                    data: transactionsToInsert,
                });

                // 4b. Upsert MonthHistory
                const dayEntries = Object.values(dayAggregations);
                for (const agg of dayEntries) {
                    if (agg.day === undefined) continue;
                    await tx.monthHistory.upsert({
                        where: {
                            userId_day_month_year: {
                                userId: user.id,
                                day: agg.day,
                                month: agg.month,
                                year: agg.year,
                            },
                        },
                        create: {
                            userId: user.id,
                            day: agg.day,
                            month: agg.month,
                            year: agg.year,
                            income: agg.income,
                            expense: agg.expense,
                        },
                        update: {
                            income: { increment: agg.income },
                            expense: { increment: agg.expense },
                        },
                    });
                }

                // 4c. Upsert YearHistory
                const monthEntries = Object.values(monthAggregations);
                for (const agg of monthEntries) {
                    await tx.yearHistory.upsert({
                        where: {
                            userId_month_year: {
                                userId: user.id,
                                month: agg.month,
                                year: agg.year,
                            },
                        },
                        create: {
                            userId: user.id,
                            month: agg.month,
                            year: agg.year,
                            income: agg.income,
                            expense: agg.expense,
                        },
                        update: {
                            income: { increment: agg.income },
                            expense: { increment: agg.expense },
                        },
                    });
                }
            },
            { timeout: 30000 }
        );

        return { success: true, count: transactionsToInsert.length };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Bulk import transaction failed";
        console.error("Bulk create failed:", message);
        return { success: false, error: message };
    }
}
