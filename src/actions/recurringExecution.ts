"use server";

import { requireUserId } from "@/lib/session";
import { processDueRecurringForUser, RecurringProcessResult } from "@/lib/recurringProcessor";

/**
 * Processes due recurring transactions for the signed-in user only.
 * Takes no user id on purpose: server actions are callable from the browser with any arguments.
 */
export async function ProcessDueRecurringTransactionsAction(): Promise<RecurringProcessResult> {
    const userId = await requireUserId();
    return processDueRecurringForUser(userId);
}
