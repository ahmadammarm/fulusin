import { ReactNode, useCallback } from "react";
import { Card } from "./ui/card";
import CountUp from "react-countup";

interface StatisticCardItemProps {
    title: string;
    value: number;
    formatter: Intl.NumberFormat;
    icon?: ReactNode;
    isHidden?: boolean;
    valueClass?: string;
    cardBackground?: string
}

export default function StatisticsCardItem({
    title,
    value,
    formatter,
    icon,
    isHidden,
    valueClass,
    cardBackground
}: StatisticCardItemProps) {


    const formatFunction = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter])


    return (
        <Card className={`p-4 ${cardBackground ? cardBackground : 'bg-card'}`}>
            <div className="flex items-center space-x-4">
                {icon}
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className={`mt-1 text-2xl font-semibold ${valueClass ? valueClass : 'text-foreground'}`}>
                        {isHidden ? (
                            '••••••'
                        ) : (
                            <CountUp
                                start={0}
                                end={value}
                                duration={1.5}
                                separator=","
                                formattingFn={formatFunction}
                            />
                        )}
                    </h3>
                </div>
            </div>
        </Card>
    )

}