"use client";

import { ReactNode, useCallback } from "react";
import { Card } from "./ui/card";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface StatisticCardItemProps {
    title: string;
    value: number;
    formatter: Intl.NumberFormat;
    icon?: ReactNode;
    isHidden?: boolean;
    valueClass?: string;
    cardBorderClass?: string;
    subtitle?: string;
}

export default function StatisticsCardItem({
    title,
    value,
    formatter,
    icon,
    isHidden,
    valueClass,
    cardBorderClass,
    subtitle,
}: StatisticCardItemProps) {
    const formatFunction = useCallback(
        (val: number) => {
            return formatter.format(val);
        },
        [formatter]
    );

    const formattedValue = isHidden ? "••••••••" : formatter.format(value);

    return (
        <Card
            className={cn(
                "rounded-2xl border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200",
                cardBorderClass ? cardBorderClass : "border-border/80 hover:border-border"
            )}
        >
            <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                        {title}
                    </p>
                    <h3
                        className={cn(
                            "mt-1 text-xl sm:text-2xl font-bold font-mono tracking-tight truncate",
                            valueClass ? valueClass : "text-foreground"
                        )}
                        title={formattedValue}
                    >
                        <span className={isHidden ? "hidden" : "inline"}>
                            <CountUp
                                start={0}
                                end={value}
                                decimals={2}
                                duration={1.2}
                                preserveValue
                                formattingFn={formatFunction}
                            />
                        </span>
                        {isHidden && <span>••••••••</span>}
                    </h3>
                    {subtitle && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
                {icon && <div className="shrink-0">{icon}</div>}
            </div>
        </Card>
    );
}
