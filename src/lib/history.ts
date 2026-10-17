import { Prisma } from "@/generated/prisma/client";
import { TransactionType } from "@/lib/types";

interface HistoryIncrement {
    userId: string;
    day: number;
    month: number;
    year: number;
    type: TransactionType;
    amount: number;
}

/**
 * Adds a transaction amount to the pre-aggregated MonthHistory and YearHistory rows.
 * Must run inside the same Prisma transaction that creates the Transaction record.
 */
export async function incrementHistory(
    tx: Prisma.TransactionClient,
    { userId, day, month, year, type, amount }: HistoryIncrement
): Promise<void> {
    const income = type === "income" ? amount : 0;
    const expense = type === "expense" ? amount : 0;

    await tx.monthHistory.upsert({
        where: { userId_day_month_year: { userId, day, month, year } },
        create: { userId, day, month, year, income, expense },
        update: { income: { increment: income }, expense: { increment: expense } },
    });

    await tx.yearHistory.upsert({
        where: { userId_month_year: { userId, month, year } },
        create: { userId, month, year, income, expense },
        update: { income: { increment: income }, expense: { increment: expense } },
    });
}
