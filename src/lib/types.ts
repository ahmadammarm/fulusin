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

export type FinancialAnalysis = {
    totalIncome: number;
    totalExpense: number;
    netFlow: number;
    topExpenseCategories: Array<{category: string; amnout: number; percentage: number;}>
    monthlyTrend: Array<{month: string; income: number; expense: number}>;
    savingsRate: number;
}