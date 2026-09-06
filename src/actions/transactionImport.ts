"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

export async function BulkCreateTransactionsAction(transactions: CreateTransactionSchemaType[]) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error("Unauthorized");
    }

    if (!transactions || transactions.length === 0) {
        return { success: false, error: "No transactions to import" };
    }

    // 1. Validate all inputs
    const parsedTransactions: CreateTransactionSchemaType[] = [];
    for (const t of transactions) {
        const parsed = CreateTransactionSchema.safeParse(t);
        if (!parsed.success) {
            return { success: false, error: `Invalid data format for transaction: ${t.description || "Unknown"}` };
        }
        parsedTransactions.push(parsed.data);
    }

    // 2. Fetch all user categories to validate mapping
    const userCategories = await prisma.category.findMany({
        where: { userId: user.id },
    });

    const categoryMap = new Map(userCategories.map(c => [c.name.toLowerCase() + '-' + c.type, c]));

    const transactionsToInsert: {
        userId: string;
        amount: number;
        date: Date;
        description: string;
        type: string;
        category: string;
        categoryIcon: string;
    }[] = [];
    const monthAggregations: Record<string, { income: number; expense: number; month: number; year: number }> = {};
    const dayAggregations: Record<string, { income: number; expense: number; day: number; month: number; year: number }> = {};

    // 3. Process transactions and aggregate history
    for (const t of parsedTransactions) {
        const catKey = t.category.toLowerCase() + '-' + t.type;
        const categoryRow = categoryMap.get(catKey);

        if (!categoryRow) {
            return { success: false, error: `Category '${t.category}' (type: ${t.type}) not found. Please create it first.` };
        }

        const transactionDate = new Date(t.date);
        const normalizedDate = fromZonedTime(startOfDay(transactionDate), TIMEZONE);
        
        const day = normalizedDate.getUTCDate();
        const month = normalizedDate.getUTCMonth() + 1;
        const year = normalizedDate.getUTCFullYear();

        transactionsToInsert.push({
            userId: user.id,
            amount: t.amount,
            date: transactionDate,
            description: t.description || "",
            type: t.type,
            category: categoryRow.name,
            categoryIcon: categoryRow.icon,
        });

        const monthKey = `${year}-${month}`;
        if (!monthAggregations[monthKey]) {
            monthAggregations[monthKey] = { income: 0, expense: 0, month, year };
        }
        if (t.type === "income") monthAggregations[monthKey].income += t.amount;
        else monthAggregations[monthKey].expense += t.amount;

        const dayKey = `${year}-${month}-${day}`;
        if (!dayAggregations[dayKey]) {
            dayAggregations[dayKey] = { income: 0, expense: 0, day, month, year };
        }
        if (t.type === "income") dayAggregations[dayKey].income += t.amount;
        else dayAggregations[dayKey].expense += t.amount;
    }

    // 4. Execute transaction
    try {
        await prisma.$transaction(async (tx) => {
            // Bulk insert transactions
            await tx.transaction.createMany({
                data: transactionsToInsert,
            });

            // Upsert MonthHistory
            for (const key in dayAggregations) {
                const agg = dayAggregations[key];
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

            // Upsert YearHistory
            for (const key in monthAggregations) {
                const agg = monthAggregations[key];
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
        });

        return { success: true };
    } catch (error) {
        console.error("Bulk create failed:", error);
        return { success: false, error: "Failed to save transactions to database" };
    }
}
