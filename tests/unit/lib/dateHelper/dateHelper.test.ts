import { describe, expect, it } from "vitest";
import { getPreviousPeriod, getWibMonthRange } from "@/lib/dateHelper";

describe("getPreviousPeriod", () => {
    it("wraps to December of the previous year", () => {
        expect(getPreviousPeriod({ month: 1, year: 2026 })).toEqual({ month: 12, year: 2025 });
    });
});

describe("getWibMonthRange", () => {
    it("spans the full WIB month", () => {
        const { start, end } = getWibMonthRange(2, 2028);
        expect(start.toISOString()).toBe("2028-01-31T17:00:00.000Z");
        expect(end.toISOString()).toBe("2028-02-29T16:59:59.999Z");
    });
});
