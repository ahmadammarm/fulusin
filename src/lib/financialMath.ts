/**
 * Financial calculation utilities to prevent IEEE-754 floating-point drift.
 * Ensures consistent 2-decimal precision across all currency mutations and balance aggregations.
 */

/**
 * Rounds a monetary amount strictly to two decimal places.
 * Uses Number.EPSILON to avoid floating-point representation anomalies like 1.005 rounding down.
 */
export function roundCurrency(amount: number): number {
    if (!Number.isFinite(amount)) return 0;
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Adds two monetary values with strict 2-decimal precision.
 */
export function addCurrency(a: number, b: number): number {
    return roundCurrency(roundCurrency(a) + roundCurrency(b));
}

/**
 * Subtracts two monetary values with strict 2-decimal precision.
 */
export function subtractCurrency(a: number, b: number): number {
    return roundCurrency(roundCurrency(a) - roundCurrency(b));
}

/**
 * Checks whether an amount is effectively zero within a half-cent threshold ($0.005).
 * Eliminates residual balance fractions caused by floating-point subtractions.
 */
export function isZeroCurrency(amount: number): boolean {
    return Math.abs(roundCurrency(amount)) < 0.005;
}

/**
 * Ensures an amount does not drop below zero, returning 0 if negative.
 */
export function clampNonNegative(amount: number): number {
    const rounded = roundCurrency(amount);
    return rounded < 0 ? 0 : rounded;
}
