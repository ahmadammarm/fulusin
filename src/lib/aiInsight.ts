import { createHash } from "node:crypto";
import prisma from "@/lib/prisma";
import { formatWibDate, getNormalizedHistoryDate } from "@/lib/dateHelper";
import { roundCurrency, subtractCurrency } from "@/lib/financialMath";
import { BudgetStatus, getBudgetProgress, getGoalProgress } from "@/lib/planning";
import {
    BalanceStatistics,
    BudgetWithProgress,
    CategoryStatisticItem,
    getBalanceStatistics,
    getBudgetsWithProgress,
    getCategoriesStatistics,
} from "@/lib/statistics";
import { Period } from "@/lib/types";

const TOP_CATEGORY_COUNT = 5;
const UPCOMING_RECURRING_DAYS = 30;
const UPCOMING_RECURRING_LIMIT = 10;

export interface InsightGoal {
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date | null;
}

export interface InsightRecurring {
    type: string;
    amount: number;
    category: string;
    frequency: string;
    nextDate: Date;
}

export interface InsightInput {
    currency: string;
    from: string;
    to: string;
    current: BalanceStatistics;
    previous: BalanceStatistics;
    categories: CategoryStatisticItem[];
    budgets: BudgetWithProgress[];
    goals: InsightGoal[];
    upcomingRecurring: InsightRecurring[];
    now: Date;
}

/**
 * Everything the model sees. All figures are computed here so the model only has to explain them.
 */
export interface FinancialSnapshot {
    currency: string;
    period: { from: string; to: string; days: number };
    totals: { income: number; expense: number; net: number; savingsRatePercent: number | null };
    previousPeriod: {
        from: string;
        to: string;
        income: number;
        expense: number;
        incomeChangePercent: number | null;
        expenseChangePercent: number | null;
    };
    topExpenseCategories: Array<{ category: string; amount: number; shareOfExpensesPercent: number }>;
    topIncomeCategories: Array<{ category: string; amount: number }>;
    budgets: Array<{
        month: string;
        category: string;
        limit: number;
        spent: number;
        usedPercent: number;
        status: BudgetStatus;
    }>;
    goals: Array<{
        name: string;
        target: number;
        saved: number;
        progressPercent: number;
        daysLeft: number | null;
        isCompleted: boolean;
    }>;
    upcomingRecurring: Array<{ type: string; category: string; amount: number; frequency: string; nextDate: string }>;
}

function shiftYmd(ymd: string, days: number): string {
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function countDays(from: string, to: string): number {
    const toUtc = (ymd: string) => {
        const [year, month, day] = ymd.split("-").map(Number);
        return Date.UTC(year, month - 1, day);
    };
    return Math.round((toUtc(to) - toUtc(from)) / 86_400_000) + 1;
}

/**
 * Returns the range of the same length that ends the day before `from`.
 */
export function getPreviousRange(from: string, to: string): { from: string; to: string } {
    const days = countDays(from, to);
    const previousTo = shiftYmd(from, -1);
    return { from: shiftYmd(previousTo, -(days - 1)), to: previousTo };
}

/**
 * Lists every calendar month touched by the range, oldest first.
 */
export function getPeriodsInRange(from: string, to: string): Period[] {
    const [fromYear, fromMonth] = from.split("-").map(Number);
    const [toYear, toMonth] = to.split("-").map(Number);
    const periods: Period[] = [];

    for (let year = fromYear, month = fromMonth; year < toYear || (year === toYear && month <= toMonth); ) {
        periods.push({ month, year });
        if (month === 12) {
            month = 1;
            year += 1;
        } else {
            month += 1;
        }
    }

    return periods;
}

export function percentChange(current: number, previous: number): number | null {
    if (previous <= 0) return null;
    return Math.round(((current - previous) * 100) / previous);
}

function percentOf(value: number, total: number): number {
    return total > 0 ? Math.round((value * 100) / total) : 0;
}

export function buildFinancialSnapshot(input: InsightInput): FinancialSnapshot {
    const { current, previous } = input;
    const net = subtractCurrency(current.income, current.expense);
    const previousRange = getPreviousRange(input.from, input.to);

    const sumsOf = (type: string) =>
        input.categories
            .filter((row) => row.type === type)
            .map((row) => ({ category: row.category, amount: roundCurrency(row._sum.amount ?? 0) }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, TOP_CATEGORY_COUNT);

    return {
        currency: input.currency,
        period: { from: input.from, to: input.to, days: countDays(input.from, input.to) },
        totals: {
            income: current.income,
            expense: current.expense,
            net,
            savingsRatePercent: current.income > 0 ? Math.round((net * 100) / current.income) : null,
        },
        previousPeriod: {
            ...previousRange,
            income: previous.income,
            expense: previous.expense,
            incomeChangePercent: percentChange(current.income, previous.income),
            expenseChangePercent: percentChange(current.expense, previous.expense),
        },
        topExpenseCategories: sumsOf("expense").map((row) => ({
            ...row,
            shareOfExpensesPercent: percentOf(row.amount, current.expense),
        })),
        topIncomeCategories: sumsOf("income"),
        budgets: input.budgets.map((budget) => {
            const progress = getBudgetProgress(budget.spent, budget.amount);
            return {
                month: `${budget.year}-${String(budget.month).padStart(2, "0")}`,
                category: budget.category,
                limit: roundCurrency(budget.amount),
                spent: budget.spent,
                usedPercent: progress.percentage,
                status: progress.status,
            };
        }),
        goals: input.goals.map((goal) => {
            const progress = getGoalProgress(goal.currentAmount, goal.targetAmount, goal.deadline, input.now);
            return {
                name: goal.name,
                target: roundCurrency(goal.targetAmount),
                saved: roundCurrency(goal.currentAmount),
                progressPercent: progress.percentage,
                daysLeft: progress.daysLeft,
                isCompleted: progress.isCompleted,
            };
        }),
        upcomingRecurring: input.upcomingRecurring.map((rule) => ({
            type: rule.type,
            category: rule.category,
            amount: roundCurrency(rule.amount),
            frequency: rule.frequency,
            nextDate: formatWibDate(rule.nextDate),
        })),
    };
}

export function hasActivity(snapshot: FinancialSnapshot): boolean {
    return snapshot.totals.income > 0 || snapshot.totals.expense > 0;
}

/**
 * Identifies a snapshot for caching: the same data and model always produce the same hash.
 */
export function hashSnapshot(snapshot: FinancialSnapshot, model: string): string {
    return createHash("sha256").update(model).update(JSON.stringify(snapshot)).digest("hex");
}

export async function loadInsightInput(userId: string, from: Date, to: Date, now: Date = new Date()): Promise<InsightInput> {
    const fromYmd = formatWibDate(from);
    const toYmd = formatWibDate(to);
    const previousRange = getPreviousRange(fromYmd, toYmd);
    const recurringUntil = getNormalizedHistoryDate(shiftYmd(formatWibDate(now), UPCOMING_RECURRING_DAYS)).normalizedDate;

    const [currencySettings, current, previous, categories, budgetsByMonth, goals, upcomingRecurring] =
        await Promise.all([
            prisma.currencySettings.findUnique({ where: { userId } }),
            getBalanceStatistics(userId, from, to),
            getBalanceStatistics(userId, new Date(previousRange.from), new Date(previousRange.to)),
            getCategoriesStatistics(userId, from, to),
            Promise.all(
                getPeriodsInRange(fromYmd, toYmd).map(({ month, year }) => getBudgetsWithProgress(userId, month, year))
            ),
            prisma.goal.findMany({
                where: { userId },
                select: { name: true, targetAmount: true, currentAmount: true, deadline: true },
                orderBy: { createdAt: "asc" },
            }),
            prisma.recurringTransaction.findMany({
                where: { userId, nextDate: { lte: recurringUntil } },
                select: { type: true, amount: true, category: true, frequency: true, nextDate: true },
                orderBy: { nextDate: "asc" },
                take: UPCOMING_RECURRING_LIMIT,
            }),
        ]);

    return {
        currency: currencySettings?.currency ?? "USD",
        from: fromYmd,
        to: toYmd,
        current,
        previous,
        categories,
        budgets: budgetsByMonth.flat(),
        goals,
        upcomingRecurring,
        now,
    };
}
