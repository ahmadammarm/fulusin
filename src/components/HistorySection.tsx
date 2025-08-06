"use client"

import { GetFormatterForCurrency } from "@/lib/currencyFormatter"
import { Timeframe } from "@/lib/types"
import { CurrencySettings } from "@prisma/client"
import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import HistoryPeriodSelector from "./HistoryPeriodSelector"

export default function HistorySection({ currencySettings }: { currencySettings: CurrencySettings }) {


    const [timeframe, setTimeframe] = useState<Timeframe>("month")

    const [period, setPeriod] = useState<{ month: number; year: number }>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    })

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings.currency)
    }, [currencySettings.currency]);



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
            </Card >
        </div >
    )
}