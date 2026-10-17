import { QueryClient } from "@tanstack/react-query";

/**
 * Refreshes every view that reads transactions after recurring rules record new ones.
 */
export function invalidateLedgerQueries(queryClient: QueryClient) {
    return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] }),
        queryClient.invalidateQueries({ queryKey: ["overview"] }),
        queryClient.invalidateQueries({ queryKey: ["transactionHistory"] }),
        queryClient.invalidateQueries({ queryKey: ["budgets"] }),
    ]);
}

export function describeRecordedCount(count: number): string {
    return `Recorded ${count} due recurring transaction${count === 1 ? "" : "s"}`;
}
