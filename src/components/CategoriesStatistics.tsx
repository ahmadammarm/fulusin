/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import { DatetoUTCDate } from "@/lib/dateHelper";
import { CurrencySettings } from "@prisma/client"
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import SkeletonWrapper from "./SkeletonWrapper";
import { TransactionType } from "@/lib/types";
import { GetCategoriesStatisticsResponseType } from "@/app/api/statistics/categories/route";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";

interface CategoriesStatisticsProps {
    currencySettings: CurrencySettings;
    from: Date;
    to: Date;
}


export default function CategoriesStatistics({ currencySettings, from, to }: CategoriesStatisticsProps) {

    const statisticsQuery = useQuery<GetCategoriesStatisticsResponseType>({
        queryKey: ["overview", "statistics", "categories", from, to],
        queryFn: async () => {
            const response = await fetch(`/api/statistics/categories?from=${DatetoUTCDate(from)}&to=${DatetoUTCDate(to)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories statistics');
            }
            return response.json();
        }
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings?.currency);
    }, [currencySettings?.currency]);

    return (
        <div className="flex w-full flex-wrap gap-2 md:flex-nowrap px-5 py-5">
            <SkeletonWrapper isLoading={statisticsQuery.isFetching}>
                <CategoriesStatisticsCard formatter={formatter} type="income" data={statisticsQuery.data || []} />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statisticsQuery.isFetching}>
                <CategoriesStatisticsCard formatter={formatter} type="expense" data={statisticsQuery.data || []} />
            </SkeletonWrapper>
        </div>
    )
}

function CategoriesStatisticsCard({ formatter, type, data }: { formatter: Intl.NumberFormat, type: TransactionType, data: GetCategoriesStatisticsResponseType }) {
    const filteredData = data.filter(item => item.type === type);
    const total = filteredData.reduce((sum, item) => sum + (item._sum.amount || 0), 0);

    return (
        <Card className="h-80 w-full">
            <CardHeader>
                <CardTitle className="grid grid-flow-row justify-between gap-2 text-xl md:text-2xl text-gray-200 md:grid-flow-col">
                    {type === "income" ? "Income by Categories" : "Expense by Categories"}
                </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                {filteredData.length === 0 && (
                    <div className="flex h-60 w-full flex-col items-center justify-center">
                        <p className="text-muted-foreground">No data available for this period</p>
                        <p className="text-sm text-muted-foreground">
                            Try selecting a different period or add a new {""}
                            {type === "income" ? "income" : "expense"} transaction
                        </p>
                    </div>
                )}
                {filteredData.length > 0 && (
                    <ScrollArea className="h-60 w-full px-4">
                        <div className="flex w-full flex-col gap-4 p-4">
                            {filteredData.map((item) => {
                                const amount = item._sum.amount || 0;
                                const percentage = total > 0 ? (amount / total) * 100 : 0;

                                return (
                                    <div className="flex flex-col gap-2" key={item.category}>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center text-gray-600">
                                                {item.categoryIcon} {item.category}
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    ({percentage === 100 ? "100%" : `${percentage.toFixed(2)}%`})%
                                                </span>
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                {formatter.format(amount)}  
                                            </span>
                                        </div>
                                        <Progress value={percentage} indicator={type === "income" ? "bg-emerald-500" : "bg-red-500"} />
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    )
}