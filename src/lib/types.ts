export type TransactionType = "income" | "expense";
export type Timeframe = "month" | "year";
export type Period = { month: number; year: number };

export type HistoryData = {
    expense: number,
    income: number,
    year: number,
    month: number,
    day?: number,
}