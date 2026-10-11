"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyCombobox } from "./CurrencyCombobox"
import { CurrencySettings } from "../../src/generated/prisma/client"
import { Currencies } from "@/lib/currencies"
import { GetFormatterForCurrency } from "@/lib/currencyFormatter"
import { Badge } from "./ui/badge"
import { Coins, Sparkles, TrendingUp, TrendingDown, Info } from "lucide-react"
import SkeletonWrapper from "./SkeletonWrapper"
import { useMemo } from "react"

export default function CurrencySettingsCard() {
    const currencySettings = useQuery<CurrencySettings>({
        queryKey: ["currencySettings"],
        queryFn: async () => {
            const response = await fetch("/api/currency-setting")
            if (!response.ok) {
                throw new Error("Failed to fetch currency settings")
            }
            const data = await response.json()
            return data as CurrencySettings
        },
        refetchOnWindowFocus: false,
    })

    const activeCurrency = useMemo(() => {
        if (!currencySettings.data?.currency) return Currencies[0]
        return Currencies.find((c) => c.value === currencySettings.data.currency) || Currencies[0]
    }, [currencySettings.data?.currency])

    const formattedSamples = useMemo(() => {
        try {
            const formatter = GetFormatterForCurrency(activeCurrency.value)
            return {
                positive: formatter.format(1250000),
                negative: formatter.format(450.75),
            }
        } catch {
            return {
                positive: `${activeCurrency.value} 1,250,000.00`,
                negative: `${activeCurrency.value} 450.75`,
            }
        }
    }, [activeCurrency.value])

    return (
        <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                            <Coins className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
                                    Primary Currency
                                </CardTitle>
                                <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                                    {activeCurrency.value}
                                </Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                Set your default currency for transactions, analytics, and CSV exports.
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Currency selector */}
                    <div className="lg:col-span-5 space-y-3">
                        <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground block">
                            Active Currency
                        </label>
                        <CurrencyCombobox />
                        <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
                            <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/70" />
                            <span>
                                Currency symbol, decimal places, and grouping separators update instantly across all views.
                            </span>
                        </div>
                    </div>

                    {/* Right: Live preview card */}
                    <div className="lg:col-span-7">
                        <SkeletonWrapper isLoading={currencySettings.isLoading}>
                            <div className="rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-teal-500" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Live Formatting Preview
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        Locale: {activeCurrency.locale}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Inflow sample */}
                                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 flex flex-col justify-between">
                                        <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                                            <span className="flex items-center gap-1.5">
                                                <TrendingUp className="h-3.5 w-3.5" />
                                                Income Format
                                            </span>
                                            <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                                                Inflow
                                            </span>
                                        </div>
                                        <p className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
                                            +{formattedSamples.positive}
                                        </p>
                                    </div>

                                    {/* Outflow sample */}
                                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 flex flex-col justify-between">
                                        <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-medium mb-1">
                                            <span className="flex items-center gap-1.5">
                                                <TrendingDown className="h-3.5 w-3.5" />
                                                Expense Format
                                            </span>
                                            <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                                                Outflow
                                            </span>
                                        </div>
                                        <p className="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400 truncate">
                                            -{formattedSamples.negative}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SkeletonWrapper>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
