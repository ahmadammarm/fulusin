"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { roundCurrency } from "@/lib/financialMath";
import { getPreviousPeriod } from "@/lib/dateHelper";
import { Budget } from "@/generated/prisma/client";
import {
    BudgetDeleteSchema,
    BudgetDeleteSchemaType,
    BudgetPeriodSchema,
    BudgetPeriodSchemaType,
    BudgetUpsertSchema,
    BudgetUpsertSchemaType,
} from "@/schemas/budgets";

export async function UpsertBudgetAction(form: BudgetUpsertSchemaType): Promise<Budget> {
    const parsedBody = BudgetUpsertSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid budget data provided");
    }

    const userId = await requireUserId();
    const { category, month, year } = parsedBody.data;
    const amount = roundCurrency(parsedBody.data.amount);

    const categoryRow = await prisma.category.findUnique({
        where: { userId_name_type: { userId, name: category, type: "expense" } },
    });

    if (!categoryRow) {
        throw new Error(`Expense category "${category}" not found`);
    }

    return prisma.budget.upsert({
        where: { userId_category_month_year: { userId, category, month, year } },
        create: { userId, category, amount, month, year },
        update: { amount },
    });
}

export async function DeleteBudgetAction(form: BudgetDeleteSchemaType): Promise<Budget> {
    const parsedBody = BudgetDeleteSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid budget data provided");
    }

    const userId = await requireUserId();

    return prisma.budget.delete({
        where: { id: parsedBody.data.id, userId },
    });
}

export interface CopyBudgetsResult {
    previousCount: number;
    copiedCount: number;
}

export async function CopyPreviousBudgetsAction(period: BudgetPeriodSchemaType): Promise<CopyBudgetsResult> {
    const parsedBody = BudgetPeriodSchema.safeParse(period);
    if (!parsedBody.success) {
        throw new Error("Invalid budget period provided");
    }

    const userId = await requireUserId();
    const { month, year } = parsedBody.data;
    const previous = getPreviousPeriod({ month, year });

    const previousBudgets = await prisma.budget.findMany({
        where: { userId, month: previous.month, year: previous.year },
        select: { category: true, amount: true },
    });

    // An empty previous month is an expected outcome, not a failure. Returning it (instead of
    // throwing) keeps the message visible, since production builds hide server action error text.
    if (previousBudgets.length === 0) {
        return { previousCount: 0, copiedCount: 0 };
    }

    // Categories already budgeted for the target month keep their current limit.
    const { count } = await prisma.budget.createMany({
        data: previousBudgets.map(({ category, amount }) => ({ userId, category, amount, month, year })),
        skipDuplicates: true,
    });

    return { previousCount: previousBudgets.length, copiedCount: count };
}
