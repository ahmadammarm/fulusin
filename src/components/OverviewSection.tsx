"use client";

import { CurrencySettings } from "../../src/generated/prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { Suspense, useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/maxDateRangeConstant";
import { toast } from "sonner";
import StatisticsCard from "./StatisticsCard";
import CategoriesStatistics from "./CategoriesStatistics";
import {
    CategoriesStatisticsSkeleton,
    StatisticsCardSkeleton,
} from "./skeletons/DashboardOverviewSkeleton";

export default function OverviewSection({ currencySettings }: { currencySettings: CurrencySettings }) {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <section className="container mx-auto px-4 sm:px-6 pt-6">
            {/* Overview Toolbar: Clean Header + Right-Aligned Date Range Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Financial Summary
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Overview of your balances and category distribution across the selected timeframe.
                    </p>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                    <DateRangePicker
                        className="w-full sm:w-auto"
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={(values) => {
                            const from = values.range.from;
                            const to = values.range.to ?? from;
                            if (!from || !to) return;
                            const [start, end] = from > to ? [to, from] : [from, to];
                            if (differenceInDays(end, start) > MAX_DATE_RANGE_DAYS) {
                                toast.error(
                                    `The selected date range is too big. Max allowed is ${MAX_DATE_RANGE_DAYS} days.`
                                );
                                return;
                            }
                            setDateRange({ from: start, to: end });
                        }}
                    />
                </div>
            </div>

            {/* Metrics & Category Sections with Granular Suspense Boundaries */}
            <div className="flex flex-col w-full gap-6 mt-6">
                <Suspense fallback={<StatisticsCardSkeleton />}>
                    <StatisticsCard currencySettings={currencySettings} from={dateRange.from} to={dateRange.to} />
                </Suspense>

                <Suspense fallback={<CategoriesStatisticsSkeleton />}>
                    <CategoriesStatistics
                        currencySettings={currencySettings}
                        from={dateRange.from}
                        to={dateRange.to}
                    />
                </Suspense>
            </div>
        </section>
    );
}
