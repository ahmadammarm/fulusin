import { PiggyBank, Wallet, TrendingDown } from "lucide-react";
import { BudgetWithProgress } from "@/app/api/budgets/route";
import { addCurrency, subtractCurrency } from "@/lib/financialMath";
import { cn } from "@/lib/utils";

interface BudgetSummaryProps {
    budgets: BudgetWithProgress[];
    formatter: Intl.NumberFormat;
}

export default function BudgetSummary({ budgets, formatter }: BudgetSummaryProps) {
    const totalLimit = budgets.reduce((sum, budget) => addCurrency(sum, budget.amount), 0);
    const totalSpent = budgets.reduce((sum, budget) => addCurrency(sum, budget.spent), 0);
    const remaining = subtractCurrency(totalLimit, totalSpent);

    const tiles = [
        { label: "Total Budget", value: totalLimit, icon: Wallet, tone: "text-teal-600 dark:text-teal-400 bg-teal-500/10" },
        { label: "Spent", value: totalSpent, icon: TrendingDown, tone: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
        {
            label: remaining >= 0 ? "Remaining" : "Over Budget",
            value: Math.abs(remaining),
            icon: PiggyBank,
            tone:
                remaining >= 0
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "text-rose-600 dark:text-rose-400 bg-rose-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tiles.map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", tone)}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
                        <p className="text-sm sm:text-base font-bold font-mono text-foreground truncate">
                            {formatter.format(value)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
