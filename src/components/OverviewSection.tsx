/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { CurrencySettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/maxDateRangeConstant";
import { toast } from "sonner";
import StatisticsCard from "./StatisticsCard";
import CategoriesStatistics from "./CategoriesStatistics";

export default function OverviewSection({ currencySettings }: { currencySettings: CurrencySettings }) {

    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <>
            <div className="container flex flex-wrap items-end justify-between gap-2 py-6 px-5">
                <h2 className="ml-5 text-3xl font-bold">
                    Overview
                </h2>
                <div className="flex items-center gap-3">
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
            <div className="container flex flex-col w-full gap-2">
                <StatisticsCard currencySettings={currencySettings} from={dateRange.from} to={dateRange.to} />
                <CategoriesStatistics currencySettings={currencySettings} from={dateRange.from} to={dateRange.to} />
            </div>
        </>
    )
}