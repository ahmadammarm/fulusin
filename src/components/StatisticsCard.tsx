"use client";

import { CurrencySettings } from "../../src/generated/prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BalanceStatistics } from "../app/api/statistics/balance/route";
import { useMemo, useState } from "react";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import { Eye, EyeOff, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatWibDate } from "@/lib/dateHelper";
import StatisticsCardItem from "./StatisticsCardItem";
import { Button } from "./ui/button";

interface StatisticCardProps {
    from: Date;
    to: Date;
    currencySettings: CurrencySettings;
}

export default function StatisticsCard({ from, to, currencySettings }: StatisticCardProps) {
    const [isShow, setIsShow] = useState<boolean>(true);

    const fromStr = useMemo(() => formatWibDate(from, "yyyy-MM-dd"), [from]);
    const toStr = useMemo(() => formatWibDate(to, "yyyy-MM-dd"), [to]);

    const { data } = useSuspenseQuery<BalanceStatistics>({
        queryKey: ["overview", "statistics", fromStr, toStr],
        queryFn: async () => {
            const response = await fetch(`/api/statistics/balance?from=${fromStr}&to=${toStr}`);
            if (!response.ok) {
                throw new Error("Failed to fetch statistics");
            }
            return response.json();
        },
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(currencySettings?.currency);
    }, [currencySettings.currency]);

    const income = data.income || 0;
    const expense = data.expense || 0;
    const balance = income - expense;

    const handleToggleHide = () => {
        setIsShow((prev) => !prev);
    };

    return (
        <div className="w-full space-y-3">
            {/* Header controls */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                    KPI Metrics
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleHide}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80 gap-1.5 cursor-pointer"
                >
                    {isShow ? (
                        <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Hide Amounts</span>
                        </>
                    ) : (
                        <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>Show Amounts</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Precision KPI Cards */}
            <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                <StatisticsCardItem
                    formatter={formatter}
                    title="Total Income"
                    value={income}
                    isHidden={!isShow}
                    icon={
                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    }
                    valueClass="text-emerald-600 dark:text-emerald-400"
                    cardBorderClass="hover:border-emerald-500/30"
                    subtitle="Gross inflow this period"
                />

                <StatisticsCardItem
                    formatter={formatter}
                    title="Total Expense"
                    value={expense}
                    isHidden={!isShow}
                    icon={
                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                    }
                    valueClass="text-rose-600 dark:text-rose-400"
                    cardBorderClass="hover:border-rose-500/30"
                    subtitle="Gross outflow this period"
                />

                <StatisticsCardItem
                    formatter={formatter}
                    title="Net Balance"
                    value={balance}
                    isHidden={!isShow}
                    icon={
                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
                            <Wallet className="h-5 w-5" />
                        </div>
                    }
                    valueClass={
                        balance >= 0
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-rose-600 dark:text-rose-400"
                    }
                    cardBorderClass="hover:border-teal-500/30"
                    subtitle={balance >= 0 ? "Positive cash reserve" : "Net deficit this period"}
                />
            </div>
        </div>
    );
}
