import prisma from "@/lib/prisma";
import { getWibDateRange, getWibMonthRange } from "@/lib/dateHelper";
import { roundCurrency } from "@/lib/financialMath";

// Read-side queries shared by the API routes and the AI insight snapshot.

export interface BalanceStatistics {
    expense: number;
    income: number;
}

export interface CategoryStatisticItem {
    type: string;
    category: string;
    categoryIcon: string;
    _sum: {
        amount: number | null;
    };
}

export interface BudgetWithProgress {
    id: string;
    category: string;
    categoryIcon: string;
    amount: number;
    spent: number;
    month: number;
    year: number;
}

export async function getBalanceStatistics(userId: string, from: Date, to: Date): Promise<BalanceStatistics> {
    const { start, end } = getWibDateRange(from, to);

    const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId,
            date: {
                gte: start,
                lte: end,
            },
        },
        _sum: {
            amount: true,
        },
    });

    const expenseRecord = totals.find((t) => t.type === "expense");
    const incomeRecord = totals.find((t) => t.type === "income");

    return {
        expense: roundCurrency(expenseRecord?._sum.amount ?? 0),
        income: roundCurrency(incomeRecord?._sum.amount ?? 0),
    };
}

export async function getCategoriesStatistics(
    userId: string,
    from: Date,
    to: Date
): Promise<CategoryStatisticItem[]> {
    const { start, end } = getWibDateRange(from, to);

    const statistics = await prisma.transaction.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: {
            userId,
            date: {
                gte: start,
                lte: end,
            },
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: "desc",
            },
        },
    });

    return statistics;
}

export async function getBudgetsWithProgress(
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
