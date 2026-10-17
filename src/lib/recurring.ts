import { getNormalizedHistoryDate } from "@/lib/dateHelper";

export const RECURRING_FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;

export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];

export const RECURRING_FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
    daily: "Every day",
    weekly: "Every week",
    monthly: "Every month",
    yearly: "Every year",
};

/** Upper bound of occurrences created for one rule in a single processing run. */
export const MAX_OCCURRENCES_PER_RUN = 366;

function daysInMonth(year: number, monthIndex: number): number {
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/**
 * Shifts a date by `steps` periods on the Asia/Jakarta calendar and returns WIB start-of-day.
 * Month and year steps clamp to the last valid day (Jan 31 + 1 month = Feb 28/29).
 */
export function shiftRecurringDate(date: Date, frequency: RecurringFrequency, steps = 1): Date {
    const { day, month, year } = getNormalizedHistoryDate(date);
    const monthIndex = month - 1;
    let target: Date;

    switch (frequency) {
        case "daily":
            target = new Date(Date.UTC(year, monthIndex, day + steps));
            break;
        case "weekly":
            target = new Date(Date.UTC(year, monthIndex, day + 7 * steps));
            break;
        case "monthly": {
            const first = new Date(Date.UTC(year, monthIndex + steps, 1));
            const clampedDay = Math.min(day, daysInMonth(first.getUTCFullYear(), first.getUTCMonth()));
            target = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), clampedDay));
            break;
        }
        case "yearly": {
            const clampedDay = Math.min(day, daysInMonth(year + steps, monthIndex));
            target = new Date(Date.UTC(year + steps, monthIndex, clampedDay));
            break;
        }
    }

    return getNormalizedHistoryDate(target.toISOString().slice(0, 10)).normalizedDate;
}

/**
 * Lists every occurrence from `nextDate` up to `now` (capped at `limit`) and the date that follows them.
 * Occurrences are offsets from `nextDate`, so month-end clamping doesn't drift within one run.
 */
export function getDueOccurrences(
    nextDate: Date,
    frequency: RecurringFrequency,
    now: Date,
    limit = MAX_OCCURRENCES_PER_RUN
): { dates: Date[]; followingDate: Date } {
    const dates: Date[] = [];
    let candidate = shiftRecurringDate(nextDate, frequency, 0);

    while (candidate <= now && dates.length < limit) {
        dates.push(candidate);
        candidate = shiftRecurringDate(nextDate, frequency, dates.length);
    }

    return { dates, followingDate: candidate };
}

export function isRecurringFrequency(value: string): value is RecurringFrequency {
    return (RECURRING_FREQUENCIES as readonly string[]).includes(value);
}
