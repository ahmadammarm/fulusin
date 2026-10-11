"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Database, FileSpreadsheet, Layers, ShieldCheck } from "lucide-react"

export default function Features() {

    return (
        <section id="features" className="py-20 md:py-28 bg-card/40 border-y border-border/60 relative">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <span>Architected For Precision</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Built like a database engine,{" "}
                        <span className="text-teal-600 dark:text-teal-400">
                            designed for humans.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Every feature in Fulusin is engineered to eliminate calculation latency, protect relational
                        data integrity, and provide absolute clarity over your personal cash flow.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {/* Bento Tile 1: Pre-Aggregated History (Span 2 cols on lg) */}
                    <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    <Database className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[11px] font-mono border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/5">
                                    O(1) Chart Queries
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Atomic Pre-Aggregated History
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Never wait for slow table scans. Fulusin atomically synchronizes daily and monthly balance
                                summaries at transaction write-time, enabling sub-millisecond dashboard renders even with tens of thousands of records.
                            </p>
                        </div>

                        {/* Interactive Widget Visualization */}
                        <div className="mt-6 pt-4 border-t border-border/60">
                            <div className="rounded-xl bg-muted/40 p-4 border border-border/60 font-mono text-xs space-y-2">
                                <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border/40">
                                    <span>TABLE: MonthHistory</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">STATUS: ACID Synced</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                                    <div className="bg-background/80 rounded-lg p-2 border border-border/40">
                                        <p className="text-[10px] text-muted-foreground uppercase">Day</p>
                                        <p className="font-bold text-foreground">11</p>
                                    </div>
                                    <div className="bg-background/80 rounded-lg p-2 border border-border/40">
                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase">Inflow</p>
                                        <p className="font-bold text-emerald-600 dark:text-emerald-400">+$2,450.00</p>
                                    </div>
                                    <div className="bg-background/80 rounded-lg p-2 border border-border/40">
                                        <p className="text-[10px] text-rose-600 dark:text-rose-400 uppercase">Outflow</p>
                                        <p className="font-bold text-rose-600 dark:text-rose-400">-$385.20</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 2: CSV Bulk Ingestion (Span 2 cols on md, 2 on lg) */}
                    <div className="md:col-span-1 lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[11px] font-mono border-border">
                                    Batch Processing
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                High-Speed Bank Statement Import
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Upload months of bank activity in a single CSV file. Fulusin automatically extracts dates,
                                amounts, categories, and descriptions, verifying each line through validation schemas.
                            </p>
                        </div>

                        {/* Interactive Visual Cue */}
                        <div className="mt-6 pt-4 border-t border-border/60">
                            <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 border border-border/60 text-xs">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="font-medium text-foreground">bca_october_statement.csv</span>
                                </div>
                                <span className="font-mono text-muted-foreground">148 rows processed</span>
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
                                    Foreign Key Protection
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Custom Category Channels
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Organize cash flows by your lifestyle. Create bespoke categories with custom icons,
                                inspect transaction counts, and rely on relational safeguards that prevent orphaned data.
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>💼</span>
                                <span className="font-medium text-foreground truncate">Engineering Retainer</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>🥑</span>
                                <span className="font-medium text-foreground truncate">Organic Groceries</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>💻</span>
                                <span className="font-medium text-foreground truncate">Cloud & Dev Tools</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                                <span>☕</span>
                                <span className="font-medium text-foreground truncate">Coffee & Workspace</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 4: Timezone Normalized Accounting (Span 1 col on lg) */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Timezone Anchored
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Midnight shifts will never corrupt your monthly sums. Every date is anchored to your exact timezone before aggregation.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border/60">
                            <span className="font-mono text-xs text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                                Asia/Jakarta (WIB)
                            </span>
                        </div>
                    </div>

                    {/* Bento Tile 5: Bank-Grade Privacy & Relational Integrity (Span 1 col on lg) */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-teal-500/40 transition-all duration-300 shadow-sm">
                        <div className="space-y-3">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Zero Data Selling
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your ledger belongs to you. Zero trackers, zero financial data reselling, and instant CSV export anytime.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border/60">
                            <span className="font-mono text-xs text-muted-foreground">
                                Self-Hosted PostgreSQL
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
