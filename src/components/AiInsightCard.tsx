"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Lightbulb, Loader2, RefreshCw, Sparkles, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { CurrencySettings } from "@/generated/prisma/client";
import type { InsightResponse } from "@/app/api/ai/insights/route";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import { formatWibDate } from "@/lib/dateHelper";
import { BUDGET_STATUS_STYLES } from "@/lib/planning";
import { cn } from "@/lib/utils";
import { InsightSeverity } from "@/schemas/ai";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface AiInsightCardProps {
    from: Date;
    to: Date;
    currencySettings: CurrencySettings;
}

const SEVERITY_STYLES: Record<InsightSeverity, string> = {
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    warning: BUDGET_STATUS_STYLES.warning.badge,
    critical: BUDGET_STATUS_STYLES.exceeded.badge,
};

export default function AiInsightCard({ from, to, currencySettings }: AiInsightCardProps) {
    const fromStr = useMemo(() => formatWibDate(from, "yyyy-MM-dd"), [from]);
    const toStr = useMemo(() => formatWibDate(to, "yyyy-MM-dd"), [to]);
    const rangeKey = `${fromStr}:${toStr}`;

    // Results are kept per date range so switching back to a range shows its last insight.
    const [results, setResults] = useState<Record<string, InsightResponse>>({});
    const result = results[rangeKey];

    const formatter = useMemo(
        () => GetFormatterForCurrency(currencySettings.currency),
        [currencySettings.currency]
    );

    const mutation = useMutation({
        mutationFn: async (): Promise<InsightResponse> => {
            const response = await fetch("/api/ai/insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ from: fromStr, to: toStr }),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(data?.message || "Could not generate insights right now.");
            }
            return data;
        },
        onSuccess: (data) => {
            setResults((previous) => ({ ...previous, [rangeKey]: data }));
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const isLoading = mutation.isPending;

    return (
        <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
                        <p className="text-xs text-muted-foreground">
                            Analysis of your finances from {fromStr} to {toStr}.
                        </p>
                    </div>
                </div>

                <Button
                    size="sm"
                    onClick={() => mutation.mutate()}
                    disabled={isLoading}
                    className="h-9 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : result ? (
                        <RefreshCw className="h-4 w-4" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    {result ? "Regenerate" : "Generate insights"}
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : !result ? (
                <p className="text-sm text-muted-foreground">
                    Get a short summary of this period with highlights, risks, and suggestions based on your
                    transactions, budgets, and goals.
                </p>
            ) : result.empty ? (
                <p className="text-sm text-muted-foreground">
                    There are no transactions in this period yet, so there is nothing to analyze.
                </p>
            ) : (
                <div className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="font-normal">
                            Net {formatter.format(result.snapshot.totals.net)}
                        </Badge>
                        {result.snapshot.totals.savingsRatePercent !== null && (
                            <Badge variant="outline" className="font-normal">
                                Savings rate {result.snapshot.totals.savingsRatePercent}%
                            </Badge>
                        )}
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                            {result.cached ? "Cached" : "Generated"} {formatWibDate(result.generatedAt, "d MMM yyyy, HH:mm")}
                        </Badge>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed">{result.insight.summary}</p>

                    <InsightList
                        title="Highlights"
                        icon={<ThumbsUp className="h-4 w-4 text-emerald-500" />}
                        items={result.insight.highlights}
                    />

                    {result.insight.warnings.length > 0 && (
                        <section className="space-y-2">
                            <h4 className="flex items-center gap-2 text-sm font-semibold">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Watch out
                            </h4>
                            <ul className="space-y-2">
                                {result.insight.warnings.map((warning) => (
                                    <li
                                        key={warning.title}
                                        className={cn("rounded-lg border p-3", SEVERITY_STYLES[warning.severity])}
                                    >
                                        <p className="text-sm font-medium">{warning.title}</p>
                                        <p className="text-xs sm:text-sm mt-0.5 text-foreground/80">{warning.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <InsightList
                        title="Suggestions"
                        icon={<Lightbulb className="h-4 w-4 text-teal-500" />}
                        items={result.insight.recommendations}
                    />
                </div>
            )}

            <p className="text-[11px] text-muted-foreground">
                Generated by AI from your aggregated totals only. Not professional financial advice.
            </p>
        </div>
    );
}

function InsightList({
    title,
    icon,
    items,
}: {
    title: string;
    icon: React.ReactNode;
    items: Array<{ title: string; detail: string }>;
}) {
    if (items.length === 0) return null;

    return (
        <section className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
                {icon}
                {title}
            </h4>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.title} className="rounded-lg border border-border/80 bg-muted/30 p-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
