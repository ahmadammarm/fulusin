import { startOfDay } from "date-fns"
import { fromZonedTime } from "date-fns-tz"

export const APP_TIMEZONE = "Asia/Jakarta"

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
    )
}

export interface NormalizedHistoryDate {
    day: number
    month: number
    year: number
    normalizedDate: Date
}

/**
 * Normalizes a transaction date to Asia/Jakarta timezone start-of-day
 * and extracts UTC day, month, and year values for consistent history records.
 */
export function getNormalizedHistoryDate(date: Date | string): NormalizedHistoryDate {
    const d = typeof date === "string" ? new Date(date) : date
    const normalized = fromZonedTime(startOfDay(d), APP_TIMEZONE)
    return {
        day: normalized.getUTCDate(),
        month: normalized.getUTCMonth() + 1,
        year: normalized.getUTCFullYear(),
        normalizedDate: normalized,
    }
}
