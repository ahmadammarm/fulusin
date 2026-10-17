"use client";

import { Input } from "@/components/ui/input";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter";

interface AmountInputProps {
    value: number;
    onChange: (value: number) => void;
}

export default function AmountInput({ value, onChange }: AmountInputProps) {
    const { symbol } = useCurrencyFormatter();

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-muted text-xs font-mono font-bold text-foreground border border-border/80">
                    {symbol}
                </span>
            </div>
            <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="h-12 pl-14 sm:pl-16 pr-4 text-xl font-mono font-bold tracking-tight bg-muted/20 border-border/80 focus-visible:ring-1"
                value={value === 0 ? "" : value}
                onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    onChange(isNaN(parsed) ? 0 : parsed);
                }}
            />
        </div>
    );
}
