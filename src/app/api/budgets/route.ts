import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getWibMonthRange } from "@/lib/dateHelper";
import { roundCurrency } from "@/lib/financialMath";
import { BudgetPeriodQuerySchema } from "@/schemas/budgets";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export interface BudgetWithProgress {
    id: string;
    category: string;
    categoryIcon: string;
    amount: number;
    spent: number;
    month: number;
    year: number;
}

export type GetBudgetsResponseType = BudgetWithProgress[];

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = BudgetPeriodQuerySchema.safeParse({
            month: searchParams.get("month"),
            year: searchParams.get("year"),
        });

        if (!queryParams.success) {
            return NextResponse.json(
                { error: queryParams.error.issues[0]?.message || "Invalid query parameters" },
                { status: 400 }
            );
        }

        const { month, year } = queryParams.data;
        const budgets = await getBudgetsWithProgress(user.id, month, year);

        return NextResponse.json(budgets);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch budgets";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function getBudgetsWithProgress(
    userId: string,
    month: number,
    year: number
): Promise<BudgetWithProgress[]> {
    const { start, end } = getWibMonthRange(month, year);

    // Spending is summed from Transaction because MonthHistory/YearHistory don't track categories.
    const [budgets, spending, categories] = await Promise.all([
        prisma.budget.findMany({
            where: { userId, month, year },
            orderBy: { category: "asc" },
        }),
        prisma.transaction.groupBy({
            by: ["category"],
            where: { userId, type: "expense", date: { gte: start, lte: end } },
            _sum: { amount: true },
        }),
        prisma.category.findMany({
            where: { userId, type: "expense" },
            select: { name: true, icon: true },
        }),
    ]);

    const spentByCategory = new Map(spending.map((row) => [row.category, row._sum.amount ?? 0]));
    const iconByCategory = new Map(categories.map((row) => [row.name, row.icon]));

    return budgets.map((budget) => ({
        id: budget.id,
        category: budget.category,
        categoryIcon: iconByCategory.get(budget.category) ?? "",
        amount: budget.amount,
        spent: roundCurrency(spentByCategory.get(budget.category) ?? 0),
        month: budget.month,
        year: budget.year,
    }));
}
