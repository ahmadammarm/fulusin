"use client"

import { MAX_DATE_RANGE_DAYS } from "@/lib/maxDateRangeConstant";
import { DateRangePicker } from "./ui/date-range-picker";
import { useState } from "react";
import { differenceInDays, startOfMonth } from "date-fns";
import { toast } from "sonner";

export default function TransactionHistoryHeader() {

    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date()
    });

    return (
        <div className="border-b bg-card">
            <div className="container flex flex-wrap items-center justify-between gap-6 py-8 px-4">
                <div>
                    <p className="text-3xl font-bold">
                        Transactions History
                    </p>
                </div>
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                        const { from, to } = values.range;
                        if (!from || !to) return;
                        if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                            toast.error(`The selected date range is too big. Max allowed is ${MAX_DATE_RANGE_DAYS} days.`,)
                            return;
                        }
                        setDateRange({ from, to });
                    }}
                />
            </div>
        </div>
    )
}