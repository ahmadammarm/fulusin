/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

export async function updateCurrencySetting(currency: string) {
    try {

    } catch (error: any) {
        return {
            error: error?.message || "An error occurred while updating the currency setting."
        };
    }
}