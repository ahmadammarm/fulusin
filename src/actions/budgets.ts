"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function CreateBudgetAction(category: string, amount: number, month: number, year: number) {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    return prisma.budget.upsert({
        where: {
            userId_category_month_year: {
                userId: user.id,
                category,
                month,
                year,
            },
        },
        create: {
            userId: user.id,
            category,
            amount,
            month,
            year,
        },
        update: {
            amount,
        },
    });
}

export async function GetBudgetsAction(month: number, year: number) {
    const session = await auth();
    const user = session?.user;
    if (!user) return [];

    return prisma.budget.findMany({
        where: { userId: user.id, month, year },
    });
}
