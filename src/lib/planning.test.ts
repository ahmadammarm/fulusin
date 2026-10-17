import { describe, expect, it } from "vitest";
import { getBudgetProgress, getGoalProgress } from "@/lib/planning";
import { getPreviousPeriod, getWibMonthRange } from "@/lib/dateHelper";

describe("getBudgetProgress", () => {
    it("is safe below the warning threshold", () => {
        expect(getBudgetProgress(79, 100)).toEqual({ percentage: 79, remaining: 21, status: "safe" });
    });

    it("warns from 80% up to and including 100%", () => {
        expect(getBudgetProgress(80, 100).status).toBe("warning");
        expect(getBudgetProgress(100, 100)).toEqual({ percentage: 100, remaining: 0, status: "warning" });
    });

    it("is exceeded above 100% and reports a negative remainder", () => {
        expect(getBudgetProgress(120.5, 100)).toEqual({
            percentage: 121,
            remaining: -20.5,
            status: "exceeded",
        });
    });

    it("handles a zero spend and a zero limit", () => {
        expect(getBudgetProgress(0, 100).percentage).toBe(0);
        expect(getBudgetProgress(10, 0).status).toBe("exceeded");
    });
});

describe("getGoalProgress", () => {
    const now = new Date("2026-10-17T00:00:00Z");

    it("computes progress and days left", () => {
        expect(getGoalProgress(250, 1000, "2026-10-27T00:00:00Z", now)).toEqual({
            percentage: 25,
            remaining: 750,
            isCompleted: false,
            daysLeft: 10,
        });
    });

    it("caps overfunded goals at 100% and marks them complete", () => {
        const progress = getGoalProgress(1200, 1000, null, now);
        expect(progress).toMatchObject({ percentage: 100, remaining: 0, isCompleted: true, daysLeft: null });
    });

    it("returns negative days for a past deadline", () => {
        expect(getGoalProgress(0, 1000, "2026-10-14T00:00:00Z", now).daysLeft).toBe(-3);
    });
});

describe("period helpers", () => {
    it("wraps to December of the previous year", () => {
        expect(getPreviousPeriod({ month: 1, year: 2026 })).toEqual({ month: 12, year: 2025 });
    });

    it("spans the full WIB month", () => {
        const { start, end } = getWibMonthRange(2, 2028);
        expect(start.toISOString()).toBe("2028-01-31T17:00:00.000Z");
        expect(end.toISOString()).toBe("2028-02-29T16:59:59.999Z");
    });
});
