"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { roundCurrency } from "@/lib/financialMath";
import { RecurringTransaction } from "@/generated/prisma/client";

export async function CreateRecurringTransactionAction(data: {
    amount: number;
    description?: string;
    type: string;
    category: string;
    categoryIcon: string;
    frequency: string;
    nextDate: Date;
}): Promise<RecurringTransaction> {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const safeAmount = roundCurrency(data.amount);
    if (safeAmount <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    return prisma.recurringTransaction.create({
        data: {
            ...data,
            amount: safeAmount,
            userId: user.id,
        },
    });
}

export async function GetRecurringTransactionsAction(): Promise<RecurringTransaction[]> {
    const session = await auth();
    const user = session?.user;
    if (!user) return [];

    return prisma.recurringTransaction.findMany({
        where: { userId: user.id },
        orderBy: { nextDate: "asc" },
    });
}

export async function DeleteRecurringTransactionAction(id: string): Promise<RecurringTransaction> {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    return prisma.recurringTransaction.delete({
        where: { id, userId: user.id },
    });
}
