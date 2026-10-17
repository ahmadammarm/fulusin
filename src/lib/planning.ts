import { differenceInCalendarDays } from "date-fns";
import { roundCurrency, subtractCurrency } from "@/lib/financialMath";

export type BudgetStatus = "safe" | "warning" | "exceeded";

export interface BudgetProgress {
    percentage: number;
    remaining: number;
    status: BudgetStatus;
}

export interface GoalProgress {
    percentage: number;
    remaining: number;
    isCompleted: boolean;
    daysLeft: number | null;
}

export const BUDGET_WARNING_THRESHOLD = 80;

export const BUDGET_STATUS_STYLES: Record<
    BudgetStatus,
    { label: string; text: string; badge: string; indicator: string }
> = {
    safe: {
        label: "On track",
        text: "text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        indicator: "bg-emerald-500",
    },
    warning: {
        label: "Near limit",
        text: "text-amber-600 dark:text-amber-400",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        indicator: "bg-amber-500",
    },
    exceeded: {
        label: "Over budget",
        text: "text-rose-600 dark:text-rose-400",
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        indicator: "bg-rose-500",
    },
};

function toPercentage(value: number, total: number): number {
    if (total <= 0) return value > 0 ? 100 : 0;
    return Math.round((value * 100) / total);
}

export function getBudgetProgress(spent: number, limit: number): BudgetProgress {
    const percentage = toPercentage(roundCurrency(spent), roundCurrency(limit));
    const remaining = subtractCurrency(limit, spent);
    const status: BudgetStatus =
        remaining < 0 ? "exceeded" : percentage >= BUDGET_WARNING_THRESHOLD ? "warning" : "safe";

    return { percentage, remaining, status };
}

export function getGoalProgress(
    current: number,
    target: number,
    deadline?: Date | string | null,
    now: Date = new Date()
): GoalProgress {
    const remaining = Math.max(0, subtractCurrency(target, current));

    return {
        percentage: Math.min(100, toPercentage(roundCurrency(current), roundCurrency(target))),
        remaining,
        isCompleted: remaining === 0,
        daysLeft: deadline ? differenceInCalendarDays(new Date(deadline), now) : null,
    };
}
