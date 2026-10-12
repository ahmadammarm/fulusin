"use client";

import TransactionHistoryTable from "@/components/TransactionHistoryTable";
import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import { Plus, ReceiptText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CurrencySettings } from "@/generated/prisma/client";

export default function TransactionHistoryPage() {
    const currencyQuery = useQuery<CurrencySettings>({
        queryKey: ["currencySettings"],
        queryFn: async () => {
            const res = await fetch("/api/currency-setting");
            if (!res.ok) throw new Error("Failed to fetch currency");
            return res.json();
        },
    });

    const currency = currencyQuery.data?.currency || "USD";

    return (
        <div className="min-h-full bg-background pb-12">
            {/* Header banner */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
                                    <ReceiptText className="h-5 w-5" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                                    All Transactions
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
                                Track, filter, and audit your complete financial records across income and expenses.
                            </p>
                        </div>

                        {/* Quick action buttons */}
                        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                            <CreateTransactionDialog
                                trigger={
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm whitespace-nowrap justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>New Income</span>
                                    </Button>
                                }
                                type="income"
                                currency={currency}
                            />
                            <CreateTransactionDialog
                                trigger={
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 px-3.5 bg-rose-600 hover:bg-rose-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm whitespace-nowrap justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>New Expense</span>
                                    </Button>
                                }
                                type="expense"
                                currency={currency}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content table container */}
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <TransactionHistoryTable />
            </div>
        </div>
    );
}
