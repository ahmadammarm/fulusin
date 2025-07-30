import { CurrencySettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BalanceStatistics } from '../app/api/statistics/balance/route';
import { DatetoUTCDate } from "@/lib/dateHelper";
import { useCallback, useMemo } from "react";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import SkeletonWrapper from "./SkeletonWrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "./ui/card";
import CountUp from "react-countup";

interface StatisticCardProps {
    from: Date;
    to: Date;
    currencySettings: CurrencySettings;
}
export default function StatisticsCard({ from, to, currencySettings }: StatisticCardProps) {

    const statsQuery = useQuery<BalanceStatistics>({
        queryKey: ['overview', 'statistics', from, to],
        queryFn: async () => {
            const response = await fetch(`/api/statistics/balance?from=${DatetoUTCDate(from)}&to=${DatetoUTCDate(to)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            return response.json();
        }
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
                    cardBg="bg-emerald-950/90 shadow-md"
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
                    cardBg="bg-red-950/90 shadow-md"
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
                    cardBg="bg-blue-950/90 shadow-md"
                />
            </SkeletonWrapper>
        </div>
    )
}

function StatisticsCardItem({
    title,
    value,
    formatter,
    icon,
    valueClass = "",
    cardBg = "",
}: {
    title: string;
    value: number;
    formatter: Intl.NumberFormat;
    icon?: React.ReactNode;
    valueClass?: string;
    cardBg?: string;
}) {
    const formatFunction = useCallback(
        (value: number) => {
            return formatter.format(value);
        },
        [formatter]
    );

    return (
        <Card className={`flex h-auto w-full gap-4 p-4 shadow-sm ${cardBg}`}>
            {icon}
            <div className="flex flex-col justify-center">
                <p className="text-lg text-muted-foreground">{title}</p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    formattingFn={formatFunction}
                    className={`text-2xl font-bold ${valueClass}`}
                />
            </div>
        </Card>
    );
}