"use client"

import { useState } from "react";
import { startOfMonth } from "date-fns";
import TransactionHistoryHeader from "@/components/TransactionHistory";
import TransactionHistoryTable from "@/components/TransactionHistoryTable";

export default function TransactionPage() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <>
            <TransactionHistoryHeader dateRange={dateRange} setDateRange={setDateRange} />
            <div className="container px-4">
                <TransactionHistoryTable from={dateRange.from} to={dateRange.to} />
            </div>
        </>
    );
}
