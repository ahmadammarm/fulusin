"use client"

import TransactionHistoryHeader from "@/components/TransactionHistory"
import TransactionHistoryTable from "@/components/TransactionHistoryTable"

export default function TransactionPage() {
    return (
        <>
            <TransactionHistoryHeader />
            <div className="container">
                <TransactionHistoryTable from={dateRange.from} to={dateRange.to} />
            </div>
        </>
    )
}