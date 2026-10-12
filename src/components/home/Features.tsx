"use client"

import { Badge } from "@/components/ui/badge"
import { BarChart3, CalendarClock, CheckCircle2, FileSpreadsheet, Layers, ReceiptText, Search, UploadCloud } from "lucide-react"

export default function Features() {
    return (
        <section id="features" className="py-20 md:py-28 bg-card/40 border-y border-border/60 relative">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <span>Personal Financial Essentials</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Everything you need to{" "}
                        <span className="text-teal-600 dark:text-teal-400">
                            master your money.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Clear insights, effortless tracking, and zero spreadsheet headaches. Designed to help you
                        understand your spending habits, save consistently, and achieve financial clarity.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {/* Bento Tile 1: Cash Flow Overview (Span 2 cols on lg) */}
                    <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[11px] font-mono border-border">
                                    Cash Flow Overview
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                See Your Cash Flow at a Glance
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Understand your financial trajectory in seconds. Switch between monthly and annual views to track your
                                total income, expenses, and net savings without calculating a thing.
                            </p>
                        </div>

                        {/* Real Mini UI Preview */}
                        <div className="mt-6 pt-4 border-t border-border/60">
                            <div className="rounded-xl bg-muted/40 p-4 border border-border/60 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-foreground">Period: October 2026</span>
                                    <span className="text-teal-600 dark:text-teal-400 font-mono font-medium">63% Savings Rate</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-background/80 rounded-lg p-2.5 border border-border/40">
                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Total Inflow</p>
                                        <p className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">+$8,450.00</p>
                                    </div>
                                    <div className="bg-background/80 rounded-lg p-2.5 border border-border/40">
                                        <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold uppercase">Total Outflow</p>
                                        <p className="font-mono font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400 mt-0.5">-$3,120.50</p>
                                    </div>
                                    <div className="bg-background/80 rounded-lg p-2.5 border border-teal-500/30 bg-teal-500/5">
                                        <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase">Net Savings</p>
                                        <p className="font-mono font-bold text-xs sm:text-sm text-teal-600 dark:text-teal-400 mt-0.5">+$5,329.50</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 2: CSV Bulk Ingestion (Span 2 cols on lg) */}
                    <div className="md:col-span-1 lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[11px] font-mono border-border">
                                    One-Click CSV Import
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Import Bank Statements in Seconds
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Skip tedious manual entry. Drag and drop your bank CSV files to automatically import, parse, and organize
                                months of historical activity straight into your ledger.
                            </p>
                        </div>

                        {/* Real Mini UI Preview: CSV Dropzone Card */}
                        <div className="mt-6 pt-4 border-t border-border/60">
                            <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3.5 border border-border/60 text-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                                        <UploadCloud className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate">october_bank_statement.csv</p>
                                        <p className="text-[11px] text-muted-foreground">148 rows verified</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Ready to Import
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 3: Custom Category Channels (Span 2 cols on lg) */}
                    <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    <Layers className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[11px] font-mono border-border">
                                    Custom Categories
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Organize Spending Your Way
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Tailor your finances to your real life. Create custom income and expense categories with personalized
                                icons and colors so you can categorize purchases naturally.
                            </p>
                        </div>

                        {/* Real Mini UI Preview: Category Pills */}
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>💼</span>
                                <span className="font-medium text-foreground truncate">Salary & Retainers</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>🥑</span>
                                <span className="font-medium text-foreground truncate">Fresh Groceries</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>💻</span>
                                <span className="font-medium text-foreground truncate">Cloud & Dev Tools</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>☕</span>
                                <span className="font-medium text-foreground truncate">Coffee & Cafes</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>🏠</span>
                                <span className="font-medium text-foreground truncate">Rent & Utilities</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>📈</span>
                                <span className="font-medium text-foreground truncate">Investments</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 4: Transaction History & Audit Ledger (Span 1 col on lg) */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <ReceiptText className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Instant Search & Filter
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Find any past transaction in seconds. Search by description, filter by type, and export your audit trail anytime.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border/60 space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground">
                                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="truncate">Search &quot;Workspace Café&quot;</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/50 text-xs">
                                <span className="font-medium text-foreground truncate">Workspace Café</span>
                                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">-$18.75</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 5: Recurring Commitments & Subscriptions (Span 1 col on lg) */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <CalendarClock className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Recurring Commitments
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Keep track of ongoing subscriptions, monthly retainers, and rent payments so you never lose visibility over fixed expenses.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border/60 space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50 text-xs">
                                <span className="font-medium text-foreground truncate">Cloud Hosting</span>
                                <span className="font-mono text-muted-foreground shrink-0">15th / mo</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50 text-xs">
                                <span className="font-medium text-foreground truncate">High-Speed Fiber</span>
                                <span className="font-mono text-muted-foreground shrink-0">20th / mo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
