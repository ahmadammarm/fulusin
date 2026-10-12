/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import { DatetoUTCDate } from "@/lib/dateHelper";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import SkeletonWrapper from "./SkeletonWrapper";
import { TransactionType } from "@/lib/types";
import { GetCategoriesStatisticsResponseType } from "@/app/api/statistics/categories/route";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CurrencySettings } from "@/generated/prisma/client";
import { ArrowDownLeft, ArrowUpRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoriesStatisticsProps {
    currencySettings: CurrencySettings;
    from: Date;
    to: Date;
}

export default function CategoriesStatistics({
    currencySettings,
    from,
    to,
}: CategoriesStatisticsProps) {
    const statisticsQuery = useQuery<GetCategoriesStatisticsResponseType>({
        queryKey: ["overview", "statistics", "categories", from.toISOString(), to.toISOString()],
        queryFn: async () => {
            const response = await fetch(
                `/api/statistics/categories?from=${DatetoUTCDate(from)}&to=${DatetoUTCDate(to)}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch categories statistics");
            }
            return response.json();
        },
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings?.currency);
    }, [currencySettings?.currency]);

    const incomeData = useMemo(() => {
        if (!statisticsQuery.data) return [];
        return statisticsQuery.data.filter((item: any) => item.type === "income");
    }, [statisticsQuery.data]);

    const expenseData = useMemo(() => {
        if (!statisticsQuery.data) return [];
        return statisticsQuery.data.filter((item: any) => item.type === "expense");
    }, [statisticsQuery.data]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            <SkeletonWrapper isLoading={statisticsQuery.isFetching}>
                <CategoriesStatisticsCard
                    formatter={formatter}
                    type="income"
                    data={incomeData}
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statisticsQuery.isFetching}>
                <CategoriesStatisticsCard
                    formatter={formatter}
                    type="expense"
                    data={expenseData}
                />
            </SkeletonWrapper>
        </div>
    );
}

function CategoriesStatisticsCard({
    formatter,
    type,
    data,
}: {
    formatter: Intl.NumberFormat;
    type: TransactionType;
    data: GetCategoriesStatisticsResponseType;
}) {
    const sortedData = useMemo(() => {
        return [...data]
            .filter((item: any) => item.type === type)
            .sort((a: any, b: any) => (b._sum.amount || 0) - (a._sum.amount || 0));
    }, [data, type]);

    const top3Data = useMemo(() => sortedData.slice(0, 3), [sortedData]);

    const total = sortedData.reduce(
        (sum: any, item: { _sum: { amount: any } }) => sum + (item._sum.amount || 0),
        0
    );

    const isIncome = type === "income";

    return (
        <Card className="rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl border shrink-0",
                            isIncome
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                        )}
                    >
                        {isIncome ? (
                            <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                            <ArrowUpRight className="h-4 w-4" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                            {isIncome ? "Top Income Channels" : "Top Expense Channels"}
                        </CardTitle>
                        <p className="text-[11px] text-muted-foreground truncate">
                            {isIncome ? "Top 3 inflow allocations by category" : "Top 3 outflow allocations by category"}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col justify-center">
                {top3Data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-2.5">
                            <Inbox className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            No transactions recorded
                        </p>
                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                            No {isIncome ? "income" : "expense"} activity found for the selected date range.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3.5">
                        {top3Data.map((item: any, index: number) => {
                            const amount = item._sum.amount || 0;
                            const percentage = total > 0 ? (amount / total) * 100 : 0;

                            return (
                                <div
                                    key={item.category}
                                    className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className={cn(
                                                    "flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold shrink-0 border",
                                                    index === 0
                                                        ? isIncome
                                                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                                        : "bg-muted/80 text-muted-foreground border-border/60"
                                                )}
                                            >
                                                #{index + 1}
                                            </span>
                                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs shrink-0">
                                                {item.categoryIcon}
                                            </span>
                                            <span className="font-semibold text-foreground truncate">
                                                {item.category}
                                            </span>
                                            <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                                                ({percentage === 100 ? "100%" : `${percentage.toFixed(1)}%`})
                                            </span>
                                        </div>
                                        <span
                                            className={cn(
                                                "font-mono font-bold text-xs sm:text-sm shrink-0",
                                                isIncome
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-rose-600 dark:text-rose-400"
                                            )}
                                        >
                                            {formatter.format(amount)}
                                        </span>
                                    </div>

                                    <Progress
                                        value={percentage}
                                        className="h-1.5 bg-muted/80"
                                        indicator={
                                            isIncome
                                                ? "bg-emerald-500 dark:bg-emerald-400"
                                                : "bg-rose-500 dark:bg-rose-400"
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
