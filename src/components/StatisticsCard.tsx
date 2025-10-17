"use client";

import { CurrencySettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BalanceStatistics } from '../app/api/statistics/balance/route';
import { useMemo, useState } from "react";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import SkeletonWrapper from "./SkeletonWrapper";
import { Eye, EyeOff, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import StatisticsCardItem from "./StatisticsCardItem";
import { Button } from "./ui/button";

interface StatisticCardProps {
    from: Date;
    to: Date;
    currencySettings: CurrencySettings;
}
export default function StatisticsCard({ from, to, currencySettings }: StatisticCardProps) {

    const [isShow, setIsShow] = useState<boolean>(true);

    const statsQuery = useQuery<BalanceStatistics>({
        queryKey: ['overview', 'statistics', from, to],
        queryFn: async () => {
            const response = await fetch(
                `/api/statistics/balance?from=${from.toISOString()}&to=${to.toISOString()}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            return response.json();
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 1000 * 60 * 5,
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings?.currency);
    }, [currencySettings.currency]);

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;

    const balance = income - expense;

    const handleHideAmounts = () => {
        setIsShow(!isShow);
    }

    return (
        <div className="relative w-full px-5">
            <div className="mb-3 flex justify-start">
                <Button
                    onClick={handleHideAmounts}
                    className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                >
                    {isShow ? (
                        <>
                            <EyeOff className="h-4 w-4" />
                            <span>Hide Amounts</span>
                        </>
                    ) : (
                        <>
                            <Eye className="h-4 w-4" />
                            <span>Show Amounts</span>
                        </>
                    )}
                </Button>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                <SkeletonWrapper isLoading={statsQuery.isFetching}>
                    <StatisticsCardItem
                        formatter={formatter}
                        title="Income Total"
                        value={isShow ? income : 0}
                        isHidden={!isShow}
                        icon={
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400/10">
                                <TrendingUp className="h-7 w-7 text-emerald-500" />
                            </div>
                        }
                        valueClass="text-emerald-300"
                        cardBackground="bg-emerald-950/90 shadow-md"
                    />
                </SkeletonWrapper>
                <SkeletonWrapper isLoading={statsQuery.isFetching}>
                    <StatisticsCardItem
                        formatter={formatter}
                        title="Expense Total"
                        value={isShow ? expense : 0}
                        isHidden={!isShow}
                        icon={
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-400/10">
                                <TrendingDown className="h-7 w-7 text-red-500" />
                            </div>
                        }
                        valueClass="text-red-300"
                        cardBackground="bg-red-950/90 shadow-md"
                    />
                </SkeletonWrapper>
                <SkeletonWrapper isLoading={statsQuery.isFetching}>
                    <StatisticsCardItem
                        formatter={formatter}
                        title="Balance"
                        value={isShow ? balance : 0}
                        isHidden={!isShow}
                        icon={
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-400/10">
                                <Wallet className="h-7 w-7 text-blue-500" />
                            </div>
                        }
                        valueClass="text-blue-300"
                        cardBackground="bg-blue-950/90 shadow-md"
                    />
                </SkeletonWrapper>
            </div>
        </div>
    )
}

