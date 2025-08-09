import { ReactNode, useCallback } from "react";
import { Card } from "./ui/card";
import CountUp from "react-countup";

interface StatisticCardItemProps {
    title: string;
    value: number;
    formatter: Intl.NumberFormat;
    icon?: ReactNode;
    valueClass?: string;
    cardBackground?: string
}

export default function StatisticsCardItem({
    title,
    value,
    formatter,
    icon,
    valueClass,
    cardBackground
}: StatisticCardItemProps) {


    const formatFunction = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter])


    return (
        <Card className={`flex h-auto w-full gap-4 p-4 shadow-sm ${cardBackground}`}>
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
    )

}