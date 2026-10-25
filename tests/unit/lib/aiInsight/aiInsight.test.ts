import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ default: {} }));

import {
    buildFinancialSnapshot,
    countDays,
    getPeriodsInRange,
    getPreviousRange,
    hashSnapshot,
    hasActivity,
    InsightInput,
    percentChange,
} from "@/lib/aiInsight";

const baseInput: InsightInput = {
    currency: "IDR",
    from: "2026-10-01",
    to: "2026-10-31",
    current: { income: 10_000_000, expense: 7_500_000.5 },
    previous: { income: 8_000_000, expense: 0 },
    categories: [
        { type: "expense", category: "Food", categoryIcon: "", _sum: { amount: 3_000_000 } },
        { type: "expense", category: "Rent", categoryIcon: "", _sum: { amount: 4_500_000.5 } },
        { type: "income", category: "Salary", categoryIcon: "", _sum: { amount: 10_000_000 } },
    ],
    budgets: [
        { id: "b1", category: "Food", categoryIcon: "", amount: 2_500_000, spent: 3_000_000, month: 10, year: 2026 },
    ],
    goals: [
        { name: "Emergency fund", targetAmount: 20_000_000, currentAmount: 5_000_000, deadline: new Date("2026-12-31T00:00:00Z") },
    ],
    upcomingRecurring: [
        { type: "expense", amount: 150_000, category: "Internet", frequency: "monthly", nextDate: new Date("2026-11-04T17:00:00Z") },
    ],
    now: new Date("2026-10-31T00:00:00Z"),
};

describe("date range helpers", () => {
    it("counts days inclusively", () => {
        expect(countDays("2026-10-01", "2026-10-31")).toBe(31);
        expect(countDays("2026-10-05", "2026-10-05")).toBe(1);
    });

    it("returns the previous range of the same length", () => {
        expect(getPreviousRange("2026-10-01", "2026-10-31")).toEqual({ from: "2026-08-31", to: "2026-09-30" });
        expect(getPreviousRange("2026-03-01", "2026-03-07")).toEqual({ from: "2026-02-22", to: "2026-02-28" });
    });

    it("lists every month touched by a range, across years", () => {
        expect(getPeriodsInRange("2026-11-20", "2027-01-05")).toEqual([
            { month: 11, year: 2026 },
            { month: 12, year: 2026 },
            { month: 1, year: 2027 },
        ]);
    });
});

describe("percentChange", () => {
    it("returns null when there is no previous value to compare with", () => {
        expect(percentChange(500, 0)).toBeNull();
    });

    it("rounds the change to a whole percent", () => {
        expect(percentChange(150, 120)).toBe(25);
        expect(percentChange(90, 120)).toBe(-25);
    });
});

describe("buildFinancialSnapshot", () => {
    const snapshot = buildFinancialSnapshot(baseInput);

    it("computes totals, net and savings rate", () => {
        expect(snapshot.totals).toEqual({
            income: 10_000_000,
            expense: 7_500_000.5,
            net: 2_499_999.5,
            savingsRatePercent: 25,
        });
    });

    it("compares against the previous period", () => {
        expect(snapshot.previousPeriod).toMatchObject({
            from: "2026-08-31",
            to: "2026-09-30",
            incomeChangePercent: 25,
            expenseChangePercent: null,
        });
    });

    it("ranks expense categories with their share of spending", () => {
        expect(snapshot.topExpenseCategories).toEqual([
            { category: "Rent", amount: 4_500_000.5, shareOfExpensesPercent: 60 },
            { category: "Food", amount: 3_000_000, shareOfExpensesPercent: 40 },
        ]);
        expect(snapshot.topIncomeCategories).toEqual([{ category: "Salary", amount: 10_000_000 }]);
    });

    it("includes budget status, goal progress and upcoming recurring dates in WIB", () => {
        expect(snapshot.budgets).toEqual([
            { month: "2026-10", category: "Food", limit: 2_500_000, spent: 3_000_000, usedPercent: 120, status: "exceeded" },
        ]);
        expect(snapshot.goals[0]).toMatchObject({ progressPercent: 25, daysLeft: 61, isCompleted: false });
        expect(snapshot.upcomingRecurring[0].nextDate).toBe("2026-11-05");
    });

    it("has no savings rate without income and reports no activity for an empty period", () => {
        const empty = buildFinancialSnapshot({
            ...baseInput,
            current: { income: 0, expense: 0 },
            categories: [],
        });
        expect(empty.totals.savingsRatePercent).toBeNull();
        expect(hasActivity(empty)).toBe(false);
        expect(hasActivity(snapshot)).toBe(true);
    });
});

describe("hashSnapshot", () => {
    it("is stable for the same data and changes with the data or model", () => {
        const snapshot = buildFinancialSnapshot(baseInput);
        const changed = buildFinancialSnapshot({ ...baseInput, current: { income: 10_000_000, expense: 7_600_000 } });

        expect(hashSnapshot(snapshot, "gemini-3.8-flash")).toBe(hashSnapshot(buildFinancialSnapshot(baseInput), "gemini-3.8-flash"));
        expect(hashSnapshot(changed, "gemini-3.8-flash")).not.toBe(hashSnapshot(snapshot, "gemini-3.8-flash"));
        expect(hashSnapshot(snapshot, "other-model")).not.toBe(hashSnapshot(snapshot, "gemini-3.8-flash"));
    });
});
