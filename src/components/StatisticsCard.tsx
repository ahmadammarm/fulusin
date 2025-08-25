import { CurrencySettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BalanceStatistics } from '../app/api/statistics/balance/route';
import { useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import SkeletonWrapper from "./SkeletonWrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import StatisticsCardItem from "./StatisticsCardItem";

interface StatisticCardProps {
    from: Date;
    to: Date;
    currencySettings: CurrencySettings;
}
export default function StatisticsCard({ from, to, currencySettings }: StatisticCardProps) {

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

    return (
        <div className="relative grid w-full grid-cols-1 gap-4 md:grid-cols-3 px-5">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatisticsCardItem
                    formatter={formatter}
                    title="Income Total"
                    value={income}
                    icon={
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-400/20 shadow-lg">
                            <TrendingUp className="h-8 w-8 text-emerald-500" />
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
                    value={expense}
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
                    value={balance}
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
    )
}

