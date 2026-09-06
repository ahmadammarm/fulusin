"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function CreateRecurringTransactionAction(data: {
    amount: number;
    description?: string;
    type: string;
    category: string;
    categoryIcon: string;
    frequency: string;
    nextDate: Date;
}) {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    return prisma.recurringTransaction.create({
        data: {
            ...data,
            userId: user.id,
        },
    });
}

export async function GetRecurringTransactionsAction() {
    const session = await auth();
    const user = session?.user;
    if (!user) return [];

    return prisma.recurringTransaction.findMany({
        where: { userId: user.id },
        orderBy: { nextDate: 'asc' },
    });
}

export async function DeleteRecurringTransactionAction(id: string) {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    return prisma.recurringTransaction.delete({
        where: { id, userId: user.id },
    });
}
