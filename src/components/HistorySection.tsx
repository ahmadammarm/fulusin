/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { GetFormatterForCurrency } from "@/lib/currencyFormatter"
import { Timeframe } from "@/lib/types"
import { CurrencySettings } from "../../src/generated/prisma/client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import HistoryPeriodSelector from "./HistoryPeriodSelector"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { GetHistoryDataResponseType } from "@/app/api/history-data/route"
import SkeletonWrapper from "./SkeletonWrapper"
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import CustomTooltip from "./CustomTooltip"


export default function HistorySection({ currencySettings }: { currencySettings: CurrencySettings }) {

    const [timeframe, setTimeframe] = useState<Timeframe>("month")

    const [period, setPeriod] = useState<{ month: number; year: number }>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    })

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings.currency)
    }, [currencySettings.currency]);

    const historyData = useQuery<GetHistoryDataResponseType>({
        queryKey: ["overview", "history", timeframe, period.month, period.year],
        queryFn: async () => {
            const res = await fetch(
                `/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`,
                { cache: "no-store" }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch history data");
            }

            return res.json();
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const queryClient = new QueryClient();

    queryClient.invalidateQueries({
        queryKey: ["history-data"]
    });


    const dataAvailable = useMemo(() => {
        return historyData.data?.some(
            (d) => d.income > 0 || d.expense > 0
        );
    }, [historyData.data]);

    console.log(historyData.data);

    const chartData = useMemo(() => {
        if (!historyData.data) return [];

        return historyData.data.map((item: any) => ({
            ...item,
            label:
                timeframe === "year"
                    ? new Date(item.year, item.month - 1).toLocaleString("default", { month: "short" })
                    : item.day?.toString().padStart(2, "0"),
        }));
    }, [historyData.data, timeframe]);

    useEffect(() => {
        setPeriod({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        });
    }, [timeframe]);


    return (
        <div className="container">
            <h2 className="mt-12 text-3xl font-bold px-5 mb-3">
                Transaction History
            </h2>
            <div className="flex px-5 pb-3">
                <Card className="col-span-12 mt-2 w-full">
                    <CardHeader className="gap-12">
                        <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col ">
                            <HistoryPeriodSelector
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                                period={period}
                                setPeriod={setPeriod}
                            />

                            <div className="flex h-10 gap-2 mt-5 md:mt-0">
                                <Badge variant={'outline'} className="flex items-center gap-2 text-sm">
                                    <div className="h-4 w-4 rounded-full bg-emerald-500">
                                    </div>
                                    Income
                                </Badge>
                                <Badge variant={'outline'} className="flex items-center gap-2 text-sm">
                                    <div className="h-4 w-4 rounded-full bg-red-500">
                                    </div>
                                    Expense
                                </Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SkeletonWrapper isLoading={historyData.isFetching}>
                            {dataAvailable && <ResponsiveContainer width={"100%"} height={300}>
                                <BarChart
                                    height={300}
                                    data={chartData}
                                    barCategoryGap={10}
                                >
                                    <defs>
                                        <linearGradient
                                            id="incomeBar"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset={"0"} stopColor="#10b981" stopOpacity="1" />
                                            <stop offset={"1"} stopColor="#10b981" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient
                                            id="expenseBar"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset={"0"} stopColor="#ef4444" stopOpacity="1" />
                                            <stop offset={"1"} stopColor="#ef4444" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" strokeOpacity={"0.2"} vertical={false} />
                                    <XAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 5, right: 5 }}
                                        dataKey="label"
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Bar dataKey={"income"} fill="url(#incomeBar)" radius={4} className="cursor-pointer" />
                                    <Bar dataKey={"expense"} fill="url(#expenseBar)" radius={4} className="cursor-pointer" />
                                    <Tooltip cursor={{ opacity: 0.1 }} content={(props) => (
                                        <CustomTooltip {...props} formatter={formatter} />
                                    )} />
                                </BarChart>
                            </ResponsiveContainer>}
                            {!dataAvailable && (
                                <Card className="flex h-75 flex-col items-center justify-center bg-background">
                                    No data available for the selected period.
                                    <p className="text-sm text-muted-foreground">
                                        Try select a differeng period or create a new transaction.
                                    </p>
                                </Card>
                            )}
                        </SkeletonWrapper>
                    </CardContent>
                </Card >
            </div>
        </div >
    )
}