"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface CurrencyOption {
    code: string;
    name: string;
    symbol: string;
    locale: string;
    inflow: number;
    outflow: number;
    sampleItems: {
        category: string;
        icon: string;
        desc: string;
        type: "income" | "expense";
        amount: number;
    }[];
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
];

export default function CurrencyPreview() {
    const [selectedCode, setSelectedCode] = useState<string>("USD");

    const activeCurrency =
        SUPPORTED_CURRENCIES.find((c) => c.code === selectedCode) || SUPPORTED_CURRENCIES[0];

    const formatMoney = (val: number) => {
        try {
            return new Intl.NumberFormat(activeCurrency.locale, {
                style: "currency",
                currency: activeCurrency.code,
                maximumFractionDigits: activeCurrency.code === "JPY" ? 0 : 2,
            }).format(val);
        } catch {
            return `${activeCurrency.symbol} ${val.toLocaleString()}`;
        }
    };

    const netBalance = activeCurrency.inflow - activeCurrency.outflow;

    return (
        <section id="currencies" className="py-20 md:py-28 bg-card/30 border-b border-border/60 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto space-y-4 mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Your currency,{" "}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                            rendered flawlessly.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Fulusin respects native currency conventions, decimal separators, and notation without
                        distorting underlying arithmetic precision. Select a currency below to see the live transformation.
                    </p>
                </motion.div>

                {/* Currency Switcher Buttons with Animated Layout Pill */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                        <button
                            key={currency.code}
                            type="button"
                            onClick={() => setSelectedCode(currency.code)}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors border cursor-pointer",
                                selectedCode === currency.code
                                    ? "text-white border-transparent"
                                    : "bg-background/80 text-muted-foreground border-border/80 hover:text-foreground hover:bg-muted/40"
                            )}
                        >
                            {selectedCode === currency.code && (
                                <motion.div
                                    layoutId="active-currency-pill"
                                    className="absolute inset-0 bg-teal-600 rounded-xl shadow-md shadow-teal-600/30 -z-10"
                                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                                />
                            )}
                            <span className="font-mono font-bold">{currency.code}</span>
                            <span className="opacity-80">({currency.symbol})</span>
                        </button>
                    ))}
                </motion.div>

                {/* Live Preview Display Card with Animated Content */}
                <motion.div
                    className="max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm backdrop-blur-xs"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                >
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

                    {/* KPI Metrics with Animated Transitions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                        <motion.div
                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                            className="p-4 rounded-xl border border-border/70 bg-background/50"
                        >
                            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                                <span>TOTAL INFLOW</span>
                                <ArrowDownLeft className="h-4 w-4" />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`inflow-${activeCurrency.code}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    className="text-lg sm:text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate"
                                >
                                    +{formatMoney(activeCurrency.inflow)}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                            className="p-4 rounded-xl border border-border/70 bg-background/50"
                        >
                            <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
                                <span>TOTAL OUTFLOW</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`outflow-${activeCurrency.code}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    className="text-lg sm:text-xl font-mono font-bold text-rose-600 dark:text-rose-400 truncate"
                                >
                                    -{formatMoney(activeCurrency.outflow)}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                            className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5"
                        >
                            <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">
                                <span>NET ACCUMULATION</span>
                                <TrendingUp className="h-4 w-4 text-teal-500" />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`net-${activeCurrency.code}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    className="text-lg sm:text-xl font-mono font-bold text-teal-600 dark:text-teal-400 truncate"
                                >
                                    +{formatMoney(netBalance)}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Sample Ledger Rows with Staggered Motion */}
                    <div className="rounded-xl border border-border/60 overflow-hidden bg-background/60">
                        <div className="px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider flex justify-between">
                            <span>Channel & Description</span>
                            <span>Formatted Ledger Value</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCurrency.code}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="divide-y divide-border/40"
                            >
                                {activeCurrency.sampleItems.map((item, idx) => (
                                    <motion.div
                                        key={item.desc}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05, duration: 0.25 }}
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
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
