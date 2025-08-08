"use client"

import { GetFormatterForCurrency } from "@/lib/currencyFormatter"
import { Timeframe } from "@/lib/types"
import { CurrencySettings } from "@prisma/client"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import HistoryPeriodSelector from "./HistoryPeriodSelector"
import { useQuery } from "@tanstack/react-query"
import { GetHistoryDataResponseType } from "@/app/api/history-data/route"
import SkeletonWrapper from "./SkeletonWrapper"
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

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
        queryKey: ["overview", "history", timeframe],
        queryFn: async () => fetch(`/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`)
            .then((res) => res.json())
    })

    const dataAvailable = historyData.data && historyData.data.length > 0;



    return (
        <div className="container">
            <h2 className="mt-12 text-3xl font-bold">
                Transaction History
            </h2>
            <Card className="col-span-12 mt-2 w-full">
                <CardHeader className="gap-12">
                    <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col ">
                        <HistoryPeriodSelector
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                            period={period}
                            setPeriod={setPeriod}
                        />

                        <div className="flex h-10 gap-2">
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
                                data={historyData.data}
                                barCategoryGap={10}
                            >
                                <defs>
        
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>}
                        {!dataAvailable && (
                            <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                                No data available for the selected period.
                                <p className="text-sm text-muted-foreground">
                                    Try select a differeng period or create a new transaction.
                                </p>
                            </Card>
                        )}
                    </SkeletonWrapper>
                </CardContent>
            </Card >
        </div >
    )
}