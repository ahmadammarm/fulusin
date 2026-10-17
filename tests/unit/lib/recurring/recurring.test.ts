import { describe, expect, it } from "vitest";
import { getDueOccurrences, shiftRecurringDate } from "@/lib/recurring";
import { formatWibDate, getNormalizedHistoryDate } from "@/lib/dateHelper";

const wib = (ymd: string) => getNormalizedHistoryDate(ymd).normalizedDate;
const ymd = (date: Date) => formatWibDate(date);

describe("shiftRecurringDate", () => {
    it("moves monthly dates on the WIB calendar, not the UTC one", () => {
        // 2026-10-01 WIB is 2026-09-30T17:00Z; a UTC-based addMonths would land on Oct 31.
        expect(ymd(shiftRecurringDate(wib("2026-10-01"), "monthly"))).toBe("2026-11-01");
    });

    it("clamps month-end dates", () => {
        expect(ymd(shiftRecurringDate(wib("2026-01-31"), "monthly"))).toBe("2026-02-28");
        expect(ymd(shiftRecurringDate(wib("2028-02-29"), "yearly"))).toBe("2029-02-28");
    });

    it("handles daily and weekly steps across month boundaries", () => {
        expect(ymd(shiftRecurringDate(wib("2026-12-31"), "daily"))).toBe("2027-01-01");
        expect(ymd(shiftRecurringDate(wib("2026-12-28"), "weekly"))).toBe("2027-01-04");
    });
});

describe("getDueOccurrences", () => {
    const now = new Date("2026-10-17T05:00:00Z");

    it("returns every missed occurrence and the next future date", () => {
        const { dates, followingDate } = getDueOccurrences(wib("2026-07-17"), "monthly", now);
        expect(dates.map(ymd)).toEqual(["2026-07-17", "2026-08-17", "2026-09-17", "2026-10-17"]);
        expect(ymd(followingDate)).toBe("2026-11-17");
    });

    it("keeps the original day of month after a short month", () => {
        const { dates } = getDueOccurrences(wib("2026-01-31"), "monthly", wib("2026-03-31"));
        expect(dates.map(ymd)).toEqual(["2026-01-31", "2026-02-28", "2026-03-31"]);
    });

    it("returns nothing when the rule is not due yet", () => {
        const { dates, followingDate } = getDueOccurrences(wib("2026-10-18"), "daily", now);
        expect(dates).toEqual([]);
        expect(ymd(followingDate)).toBe("2026-10-18");
    });

    it("stops at the limit and resumes from the next unprocessed date", () => {
        const { dates, followingDate } = getDueOccurrences(wib("2026-10-01"), "daily", now, 5);
        expect(dates).toHaveLength(5);
        expect(ymd(followingDate)).toBe("2026-10-06");
    });
});
