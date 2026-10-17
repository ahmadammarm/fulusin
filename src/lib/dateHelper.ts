import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Period } from "@/lib/types";

export const APP_TIMEZONE = "Asia/Jakarta";

export interface NormalizedHistoryDate {
    day: number;
    month: number;
    year: number;
    normalizedDate: Date;
}

export interface WibDateRange {
    start: Date;
    end: Date;
}

/**
 * Parses any date input (YYYY-MM-DD string, Date object, or ISO timestamp)
 * in the context of the reference Asia/Jakarta (WIB, UTC+7) timezone.
 */
export function parseWibDate(input: Date | string) {
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
        const clean = input.trim();
        const [y, m, d] = clean.split("-").map(Number);
        const start = fromZonedTime(`${clean} 00:00:00.000`, APP_TIMEZONE);
        const end = fromZonedTime(`${clean} 23:59:59.999`, APP_TIMEZONE);
        return {
            day: d,
            month: m,
            year: y,
            wibStartOfDay: start,
            wibEndOfDay: end,
        };
    }

    const dObj = typeof input === "string" ? new Date(input) : input;
    const ymd = formatInTimeZone(dObj, APP_TIMEZONE, "yyyy-MM-dd");
    const [y, m, d] = ymd.split("-").map(Number);
    const start = fromZonedTime(`${ymd} 00:00:00.000`, APP_TIMEZONE);
    const end = fromZonedTime(`${ymd} 23:59:59.999`, APP_TIMEZONE);
    return {
        day: d,
        month: m,
        year: y,
        wibStartOfDay: start,
        wibEndOfDay: end,
    };
}

/**
 * Normalizes a transaction date to Asia/Jakarta (WIB) start-of-day
 * and extracts calendar day, month, and year values in Asia/Jakarta.
 *
 * For example, for "2026-10-01":
 * - day: 1
 * - month: 10
 * - year: 2026
 * - normalizedDate: 2026-09-30T17:00:00.000Z (which is 2026-10-01 00:00:00.000 WIB)
 */
export function getNormalizedHistoryDate(date: Date | string): NormalizedHistoryDate {
    const parsed = parseWibDate(date);
    return {
        day: parsed.day,
        month: parsed.month,
        year: parsed.year,
        normalizedDate: parsed.wibStartOfDay,
    };
}

/**
 * Returns UTC Date objects for start-of-day (00:00:00.000 WIB)
 * and end-of-day (23:59:59.999 WIB) for the specified date range.
 */
export function getWibDateRange(from: Date | string, to: Date | string): WibDateRange {
    const startParsed = parseWibDate(from);
    const endParsed = parseWibDate(to);
    return {
        start: startParsed.wibStartOfDay,
        end: endParsed.wibEndOfDay,
    };
}

/**
 * Returns the WIB start and end boundaries of a calendar month (month is 1-12).
 */
export function getWibMonthRange(month: number, year: number): WibDateRange {
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const pad = (value: number) => String(value).padStart(2, "0");
    return getWibDateRange(
        `${year}-${pad(month)}-01`,
        `${year}-${pad(month)}-${pad(lastDay)}`
    );
}

/**
 * Returns the calendar month immediately before the given one.
 */
export function getPreviousPeriod({ month, year }: Period): Period {
    return month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
}

/**
 * Returns the calendar month immediately after the given one.
 */
export function getNextPeriod({ month, year }: Period): Period {
    return month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };
}

/**
 * Returns the current calendar month in Asia/Jakarta.
 */
export function getCurrentWibPeriod(): Period {
    const { month, year } = parseWibDate(new Date());
    return { month, year };
}

/**
 * Formats a Date or date string to a pattern in Asia/Jakarta timezone.
 */
export function formatWibDate(date: Date | string, pattern = "yyyy-MM-dd"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return formatInTimeZone(d, APP_TIMEZONE, pattern);
}

/**
 * Kept for backwards compatibility.
 */
export function DatetoUTCDate(date: Date) {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds()
        )
    );
}
