"use client"

import TransactionHistoryTable from "@/components/TransactionHistoryTable";

export default function TransactionHistoryPage() {
    return (
        <>
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-4">
                    <div>
                        <p className="text-3xl font-bold">All Transactions History</p>
                        <p className="text-muted-foreground mt-2">View and manage all your transactions</p>
                    </div>
                </div>
            </div>
            <div className="container py-6 px-5">
                <TransactionHistoryTable />
            </div>
        </>
    );
}