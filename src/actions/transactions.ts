"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { redirect } from "next/navigation";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { roundCurrency, subtractCurrency } from "@/lib/financialMath";
import { Prisma, Transaction } from "@/generated/prisma/client";

export async function CreateTransactionAction(form: CreateTransactionSchemaType): Promise<Transaction> {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid transaction data provided");
    }

    const session = await auth();
    const user = session?.user;
    if (!user) {
        redirect("/sign-in");
    }

    const { amount, category, date, description, type } = parsedBody.data;
    const safeAmount = roundCurrency(amount);

    if (safeAmount <= 0) {
        throw new Error("Transaction amount must be greater than zero");
    }

    const normalizedDescription = description?.trim() || "";
    const { day, month, year, normalizedDate } = getNormalizedHistoryDate(date);

    const categoryRow = await prisma.category.findUnique({
        where: {
            userId_name_type: {
                userId: user.id,
                name: category,
                type,
            },
        },
    });

    if (!categoryRow) {
        throw new Error(`Category "${category}" not found`);
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Acquire transaction advisory lock per user to serialize concurrent requests and eliminate race conditions
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tx-lock:${user.id}`}))`;

        // 2. Prevent duplicate submissions within the 10-second deduplication window
        const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
        const duplicateTransaction = await tx.transaction.findFirst({
            where: {
                userId: user.id,
                amount: safeAmount,
                type,
                category: categoryRow.name,
                date: normalizedDate,
                OR: [
                    { description: normalizedDescription },
                    ...(normalizedDescription === "" ? [{ description: null }] : []),
                ],
                createdAt: {
                    gte: tenSecondsAgo,
                },
            },
        });

        if (duplicateTransaction) {
            throw new Error(
                "Duplicate transaction detected. Please wait a few seconds before recording an identical transaction."
            );
        }

        // 3. Balance verification and overdraft tracking
        if (type === "expense") {
            const historySums = await tx.yearHistory.aggregate({
                where: { userId: user.id },
                _sum: {
                    income: true,
                    expense: true,
                },
            });
            const totalIncome = roundCurrency(historySums._sum.income || 0);
            const totalExpense = roundCurrency(historySums._sum.expense || 0);
            const availableBalance = subtractCurrency(totalIncome, totalExpense);

            if (availableBalance < safeAmount) {
                console.warn(
                    `[Overdraft Note] User ${user.id} recorded expense of ${safeAmount} with available balance of ${availableBalance}. Balance is negative.`
                );
            }
        }

        // 4. Create transaction
        const newTransaction = await tx.transaction.create({
            data: {
                userId: user.id,
                amount: safeAmount,
                date: normalizedDate,
                description: normalizedDescription,
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
            },
        });

        // 5. Atomically upsert MonthHistory
        await tx.monthHistory.upsert({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day,
                    month,
                    year,
                },
            },
            create: {
                userId: user.id,
                day,
                month,
                year,
                income: type === "income" ? safeAmount : 0,
                expense: type === "expense" ? safeAmount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? safeAmount : 0,
                },
                income: {
                    increment: type === "income" ? safeAmount : 0,
                },
            },
        });

        // 6. Atomically upsert YearHistory
        await tx.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month,
                    year,
                },
            },
            create: {
                userId: user.id,
                month,
                year,
                income: type === "income" ? safeAmount : 0,
                expense: type === "expense" ? safeAmount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? safeAmount : 0,
                },
                income: {
                    increment: type === "income" ? safeAmount : 0,
                },
            },
        });

        return newTransaction;
    });
}
