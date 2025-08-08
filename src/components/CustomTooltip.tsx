/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import CountUp from 'react-countup';


export default function CustomTooltip({ active, payload, formatter }: any) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload;
    const { income, expense } = data;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow formatter={formatter} label="Income" value={income} bgColor="bg-emerald-500" textColor="text-emerald-500" />
            <TooltipRow formatter={formatter} label="Expense" value={expense} bgColor="bg-red-500" textColor="text-red-500" />
            <TooltipRow formatter={formatter} label="Balance" value={income - expense} bgColor="bg-gray-500" textColor="text-foreground" />
        </div>
    )
}

function TooltipRow({
    label,
    value,
    formatter,
    bgColor,
    textColor
}: {
    label: string;
    value: number;
    formatter: Intl.NumberFormat;
    bgColor: string;
    textColor: string;
}) {

    const formatingFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter]);

    return (
        <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full", bgColor)} />
            <div className="w-full justify-between">
                <p className="text-sm text-muted-foreground">
                    {label}
                </p>
                <div className={cn("text-sm font-medium", textColor)}>
                    <CountUp duration={0.5} preserveValue end={value} decimals={0} formattingFn={formatingFn} className="text-sm font-medium" />
                </div>
            </div>
        </div>
    )
}