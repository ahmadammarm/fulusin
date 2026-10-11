"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CurrencyOption {
    code: string
    name: string
    symbol: string
    locale: string
    inflow: number
    outflow: number
    sampleItems: {
        category: string
        icon: string
        desc: string
        type: "income" | "expense"
        amount: number
    }[]
}

const SUPPORTED_CURRENCIES: CurrencyOption[] = [
    {
        code: "USD",
        name: "United States Dollar",
        symbol: "$",
        locale: "en-US",
        inflow: 8450.0,
        outflow: 3120.5,
        sampleItems: [
            { category: "Salary", icon: "💼", desc: "Software Engineering Retainer", type: "income", amount: 6500.0 },
            { category: "Groceries", icon: "🥑", desc: "Weekly Fresh Provisions", type: "expense", amount: 142.5 },
            { category: "Software", icon: "💻", desc: "Cloud Hosting & AI Tooling", type: "expense", amount: 64.0 },
            { category: "Freelance", icon: "📈", desc: "Consulting & Code Audit", type: "income", amount: 1950.0 },
        ],
    },
    {
        code: "IDR",
        name: "Indonesian Rupiah",
        symbol: "Rp",
        locale: "id-ID",
        inflow: 135000000,
        outflow: 48500000,
        sampleItems: [
            { category: "Salary", icon: "💼", desc: "Gaji & Retainer Bulanan", type: "income", amount: 105000000 },
            { category: "Groceries", icon: "🥑", desc: "Belanja Pasar & Supermarket", type: "expense", amount: 2450000 },
            { category: "Software", icon: "💻", desc: "Langganan Server & Domain", type: "expense", amount: 980000 },
            { category: "Freelance", icon: "📈", desc: "Jasa Arsitektur Sistem", type: "income", amount: 30000000 },
        ],
    },
    {
        code: "EUR",
        name: "European Euro",
        symbol: "€",
        locale: "de-DE",
        inflow: 7800.0,
        outflow: 2950.0,
        sampleItems: [
            { category: "Salary", icon: "💼", desc: "Engineering Festanstellung", type: "income", amount: 6100.0 },
            { category: "Groceries", icon: "🥑", desc: "Wocheneinkauf & Bio-Markt", type: "expense", amount: 135.0 },
            { category: "Software", icon: "💻", desc: "Cloud-Server & Entwicklertools", type: "expense", amount: 59.0 },
            { category: "Freelance", icon: "📈", desc: "Architektur-Beratung", type: "income", amount: 1700.0 },
        ],
    },
    {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "¥",
        locale: "ja-JP",
        inflow: 1250000,
        outflow: 480000,
        sampleItems: [
            { category: "Salary", icon: "💼", desc: "月給・エンジニア基本給", type: "income", amount: 950000 },
            { category: "Groceries", icon: "🥑", desc: "食料品・日用品買い出し", type: "expense", amount: 22000 },
            { category: "Software", icon: "💻", desc: "クラウドサーバー利用料", type: "expense", amount: 9500 },
            { category: "Freelance", icon: "📈", desc: "技術コンサルティング案件", type: "income", amount: 300000 },
        ],
    },
    {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        locale: "en-GB",
        inflow: 6700.0,
        outflow: 2540.0,
        sampleItems: [
            { category: "Salary", icon: "💼", desc: "Lead Dev Monthly Contract", type: "income", amount: 5200.0 },
            { category: "Groceries", icon: "🥑", desc: "Weekly Food & Essentials", type: "expense", amount: 115.0 },
            { category: "Software", icon: "💻", desc: "Hosting & Developer APIs", type: "expense", amount: 48.0 },
            { category: "Freelance", icon: "📈", desc: "Contract Code Review", type: "income", amount: 1500.0 },
        ],
    },
]

export default function CurrencyPreview() {
    const [selectedCode, setSelectedCode] = useState<string>("USD")

    const activeCurrency =
        SUPPORTED_CURRENCIES.find((c) => c.code === selectedCode) || SUPPORTED_CURRENCIES[0]

    const formatMoney = (val: number) => {
        try {
            return new Intl.NumberFormat(activeCurrency.locale, {
                style: "currency",
                currency: activeCurrency.code,
                maximumFractionDigits: activeCurrency.code === "JPY" ? 0 : 2,
            }).format(val)
        } catch {
            return `${activeCurrency.symbol} ${val.toLocaleString()}`
        }
    }

    const netBalance = activeCurrency.inflow - activeCurrency.outflow

    return (
        <section id="currencies" className="py-20 md:py-28 bg-card/30 border-b border-border/60">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <span>Global Locale Formatting</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Your currency,{" "}
                        <span className="text-teal-600 dark:text-teal-400">
                            rendered flawlessly.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Fulusin respects native currency conventions, decimal separators, and notation without
                        distorting underlying arithmetic precision. Select a currency below to see the live transformation.
                    </p>
                </div>

                {/* Currency Switcher Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
                    {SUPPORTED_CURRENCIES.map((currency) => (
                        <button
                            key={currency.code}
                            type="button"
                            onClick={() => setSelectedCode(currency.code)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border",
                                selectedCode === currency.code
                                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                                    : "bg-background text-muted-foreground border-border/80 hover:text-foreground hover:bg-muted/40"
                            )}
                        >
                            <span className="font-mono font-bold">{currency.code}</span>
                            <span className="opacity-80">({currency.symbol})</span>
                        </button>
                    ))}
                </div>

                {/* Live Preview Display Card */}
                <div className="max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
                    {/* Top Status Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/60">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Active Locale Format
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                {activeCurrency.name} ({activeCurrency.code})
                            </h3>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs bg-muted/40 border-border">
                            Format: {activeCurrency.locale}
                        </Badge>
                    </div>

                    {/* KPI Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                        <div className="p-4 rounded-xl border border-border/70 bg-background/50">
                            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                                <span>TOTAL INFLOW</span>
                                <ArrowDownLeft className="h-4 w-4" />
                            </div>
                            <p className="text-lg sm:text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate">
                                +{formatMoney(activeCurrency.inflow)}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-border/70 bg-background/50">
                            <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
                                <span>TOTAL OUTFLOW</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                            <p className="text-lg sm:text-xl font-mono font-bold text-rose-600 dark:text-rose-400 truncate">
                                -{formatMoney(activeCurrency.outflow)}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5">
                            <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">
                                <span>NET ACCUMULATION</span>
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <p className="text-lg sm:text-xl font-mono font-bold text-teal-600 dark:text-teal-400 truncate">
                                +{formatMoney(netBalance)}
                            </p>
                        </div>
                    </div>

                    {/* Sample Ledger Rows */}
                    <div className="rounded-xl border border-border/60 overflow-hidden bg-background/60">
                        <div className="px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider flex justify-between">
                            <span>Channel & Description</span>
                            <span>Formatted Ledger Value</span>
                        </div>
                        <div className="divide-y divide-border/40">
                            {activeCurrency.sampleItems.map((item) => (
                                <div
                                    key={item.desc}
                                    className="flex items-center justify-between p-3.5 hover:bg-muted/20 transition-colors gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 text-base border border-border/50 shrink-0">
                                            {item.icon}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                                                {item.category}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={cn(
                                            "font-mono font-bold text-xs sm:text-sm shrink-0",
                                            item.type === "income"
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-400"
                                        )}
                                    >
                                        {item.type === "income" ? "+" : "-"}
                                        {formatMoney(item.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
