/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import { Timeframe } from "@/lib/types";
import { CurrencySettings } from "../../src/generated/prisma/client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetHistoryDataResponseType } from "@/app/api/history-data/route";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import CustomTooltip from "./CustomTooltip";
import { BarChart3 } from "lucide-react";

export default function HistorySection({
    currencySettings,
}: {
    currencySettings: CurrencySettings;
}) {
    const [timeframe, setTimeframe] = useState<Timeframe>("month");

    const [period, setPeriod] = useState<{ month: number; year: number }>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings.currency);
    }, [currencySettings.currency]);

    const { data } = useSuspenseQuery<GetHistoryDataResponseType>({
        queryKey: ["overview", "history", timeframe, period.month, period.year],
        queryFn: async () => {
            const res = await fetch(
                `/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch history data");
            }

            return res.json();
        },
    });

    const dataAvailable = useMemo(() => {
        return data?.some((d) => d.income > 0 || d.expense > 0);
    }, [data]);

    const chartData = useMemo(() => {
        if (!data) return [];

        return data.map((item: any) => ({
            ...item,
            label:
                timeframe === "year"
                    ? new Date(item.year, item.month - 1).toLocaleString("default", {
                          month: "short",
                      })
                    : item.day?.toString().padStart(2, "0"),
        }));
    }, [data, timeframe]);

    useEffect(() => {
        setPeriod({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        });
    }, [timeframe]);

    return (
        <section className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Transaction History
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Cash flow velocity and historical comparison across your chosen timeline.
                    </p>
                </div>
            </div>

            <Card className="rounded-2xl border border-border/80 bg-card shadow-xs mt-6 overflow-hidden">
                <CardHeader className="p-5 pb-4 border-b border-border/60">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <HistoryPeriodSelector
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                            period={period}
                            setPeriod={setPeriod}
                        />

                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1.5 text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-1"
                            >
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                <span>Income</span>
                            </Badge>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1.5 text-xs font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 px-2.5 py-1"
                            >
                                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                                <span>Expense</span>
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                    {dataAvailable ? (
                        <div className="w-full h-[280px] sm:h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    barCategoryGap={10}
                                    barGap={3}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="incomeBar"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.15} />
                                        </linearGradient>
                                        <linearGradient
                                            id="expenseBar"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.15} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        strokeOpacity={0.2}
                                        vertical={false}
                                    />

                                    <XAxis
                                        stroke="#888888"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 10, right: 10 }}
                                        dataKey="label"
                                        dy={4}
                                    />

                                    <YAxis
                                        stroke="#888888"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-4}
                                    />

                                    <Bar
                                        dataKey="income"
                                        fill="url(#incomeBar)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={36}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        fill="url(#expenseBar)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={36}
                                    />

                                    <Tooltip
                                        cursor={{ fill: "currentColor", opacity: 0.05 }}
                                        content={(props) => (
                                            <CustomTooltip {...props} formatter={formatter} />
                                        )}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex h-[280px] w-full flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-xl bg-muted/20">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                No data available for the selected period
                            </p>
                            <p className="text-xs text-muted-foreground max-w-sm mt-1">
                                Try selecting a different year or month, or record a new transaction to visualize your cash flow.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
