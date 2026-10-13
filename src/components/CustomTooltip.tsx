import { cn } from "@/lib/utils";
import { useCallback } from "react";
import CountUp from "react-countup";

interface CustomTooltipData {
    income: number;
    expense: number;
    label?: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: ReadonlyArray<{
        payload: CustomTooltipData;
    }>;
    formatter: Intl.NumberFormat;
}

export default function CustomTooltip({ active, payload, formatter }: CustomTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload;
    const { income, expense, label } = data;
    const balance = income - expense;

    return (
        <div className="min-w-[240px] rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-3.5 shadow-lg space-y-2.5">
            {label && (
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/60">
                    Period: {label}
                </p>
            )}
            <div className="space-y-1.5">
                <TooltipRow
                    formatter={formatter}
                    label="Income"
                    value={income}
                    dotColor="bg-emerald-500"
                    textColor="text-emerald-600 dark:text-emerald-400"
                />
                <TooltipRow
                    formatter={formatter}
                    label="Expense"
                    value={expense}
                    dotColor="bg-rose-500"
                    textColor="text-rose-600 dark:text-rose-400"
                />
                <div className="pt-1 border-t border-border/40">
                    <TooltipRow
                        formatter={formatter}
                        label="Net Balance"
                        value={balance}
                        dotColor={balance >= 0 ? "bg-teal-500" : "bg-rose-500"}
                        textColor={
                            balance >= 0
                                ? "text-teal-600 dark:text-teal-400 font-bold"
                                : "text-rose-600 dark:text-rose-400 font-bold"
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function TooltipRow({
    label,
    value,
    formatter,
    dotColor,
    textColor,
}: {
    label: string;
    value: number;
    formatter: Intl.NumberFormat;
    dotColor: string;
    textColor: string;
}) {
    const formatFunction = useCallback(
        (val: number) => {
            return formatter.format(val);
        },
        [formatter]
    );

    return (
        <div className="flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
                <span className="text-muted-foreground">{label}</span>
            </div>
            <div className={cn("font-mono font-medium", textColor)}>
                <CountUp
                    duration={0.4}
                    preserveValue
                    end={value}
                    decimals={0}
                    formattingFn={formatFunction}
                />
            </div>
        </div>
    );
}
