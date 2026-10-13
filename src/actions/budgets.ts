"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { roundCurrency } from "@/lib/financialMath";
import { Budget } from "@/generated/prisma/client";

export async function CreateBudgetAction(
    category: string,
    amount: number,
    month: number,
    year: number
): Promise<Budget> {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const safeAmount = roundCurrency(amount);
    if (safeAmount <= 0) {
        throw new Error("Budget limit must be greater than zero");
    }

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
            amount: safeAmount,
            month,
            year,
        },
        update: {
            amount: safeAmount,
        },
    });
}

export async function GetBudgetsAction(month: number, year: number): Promise<Budget[]> {
    const session = await auth();
    const user = session?.user;
    if (!user) return [];

    return prisma.budget.findMany({
        where: { userId: user.id, month, year },
    });
}
