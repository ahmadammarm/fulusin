"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export default function Hero() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [mockupView, setMockupView] = useState<"ledger" | "categories">("ledger")

    const handleCTA = () => {
        if (status === "authenticated" && session?.user?.id) {
            router.push("/dashboard")
        } else {
            router.push("/sign-up")
        }
    }

    const mockTransactions = [
        {
            category: "Salary & Wages",
            icon: "💼",
            type: "income",
            desc: "Monthly Engineering Retainer",
            date: "2026-10-01",
            amount: "+$6,500.00",
        },
        {
            category: "Groceries",
            icon: "🥑",
            type: "expense",
            desc: "Weekly Market Produce & Essentials",
            date: "2026-10-04",
            amount: "-$142.50",
        },
        {
            category: "Software & Cloud",
            icon: "💻",
            type: "expense",
            desc: "Hosting, AI APIs & Tools",
            date: "2026-10-06",
            amount: "-$64.00",
        },
        {
            category: "Freelance",
            icon: "📈",
            type: "income",
            desc: "Web App Performance Audit",
            date: "2026-10-08",
            amount: "+$1,950.00",
        },
        {
            category: "Dining & Coffee",
            icon: "☕",
            type: "expense",
            desc: "Workspace Café Session",
            date: "2026-10-10",
            amount: "-$18.75",
        },
    ]

    const mockCategories = [
        { name: "Salary & Retainers", icon: "💼", type: "income", count: "2 entries", total: "+$8,450.00" },
        { name: "Groceries & Food", icon: "🥑", type: "expense", count: "14 entries", total: "-$840.20" },
        { name: "Software & Cloud", icon: "💻", type: "expense", count: "6 entries", total: "-$320.00" },
        { name: "Rent & Utilities", icon: "🏠", type: "expense", count: "2 entries", total: "-$1,650.00" },
        { name: "Investments", icon: "📊", type: "income", count: "4 entries", total: "+$420.00" },
        { name: "Travel & Transport", icon: "✈️", type: "expense", count: "8 entries", total: "-$310.30" },
    ]

    return (
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-background">
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-teal-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4 sm:px-6">
                {/* Hero Header Content */}
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    {/* Eyebrow Badge */}
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium shadow-2xs">
                        <span>Financial Ledger & Period Tracking Engine</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:leading-[1.15]">
                        Master your cash flow,{" "}
                        <span className="bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                            period by period.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Stop wrestling with rigid spreadsheets. Fulusin combines atomic pre-aggregated history,
                        custom category channels, and multi-currency tracking into one high-speed financial ledger.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs gap-2"
                            onClick={handleCTA}
                        >
                            <span>Start Tracking Free</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-medium border-border/80 text-foreground hover:bg-muted/40 gap-2"
                            onClick={() => {
                                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                            }}
                        >
                            <span>Explore Features</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Feature Proof Points */}
                    <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                            PostgreSQL ACID Atomicity
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                            Pre-Aggregated O(1) Speed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                            Bank Statement CSV Ingestion
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                            Zero Data Selling
                        </span>
                    </div>
                </div>

                {/* Live Interactive Product Mockup */}
                <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
                    <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 shadow-xl backdrop-blur-sm overflow-hidden">
                        {/* Mockup Window Titlebar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border/60 bg-muted/30 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <span className="ml-2 font-mono text-muted-foreground hidden sm:inline">
                                    app.fulusin.com/dashboard/transactions
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-[11px] bg-background border-border/80">
                                    Period: October 2026
                                </Badge>
                                <Badge variant="outline" className="font-mono text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30">
                                    Currency: USD ($)
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                            {/* Mockup KPI Metric Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <div className="p-4 rounded-xl border border-border/70 bg-background/60 shadow-2xs">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Total Records
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
                                        142
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Recorded entries
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-border/70 bg-background/60 shadow-2xs">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                        Total Inflow
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                                        +$8,450.00
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        6 income channels
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-border/70 bg-background/60 shadow-2xs">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                        Total Outflow
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                                        -$3,120.50
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        28 expense records
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 shadow-2xs">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                        Net Cash Flow
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-1">
                                        +$5,329.50
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Positive trajectory
                                    </p>
                                </div>
                            </div>

                            {/* Mockup Interactive Navigation Tabs */}
                            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                <div className="inline-flex h-9 items-center rounded-lg bg-muted/60 p-1 text-muted-foreground text-xs font-medium">
                                    <button
                                        type="button"
                                        onClick={() => setMockupView("ledger")}
                                        className={cn(
                                            "rounded-md px-3 py-1 transition-all",
                                            mockupView === "ledger"
                                                ? "bg-background text-foreground shadow-2xs"
                                                : "hover:text-foreground"
                                        )}
                                    >
                                        Live Ledger View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMockupView("categories")}
                                        className={cn(
                                            "rounded-md px-3 py-1 transition-all",
                                            mockupView === "categories"
                                                ? "bg-background text-foreground shadow-2xs"
                                                : "hover:text-foreground"
                                        )}
                                    >
                                        Category Channels
                                    </button>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                                    <span>Real-time ACID Synced</span>
                                </div>
                            </div>

                            {/* View 1: Live Ledger View */}
                            {mockupView === "ledger" ? (
                                <div className="rounded-xl border border-border/60 overflow-hidden bg-background/50">
                                    <div className="divide-y divide-border/40">
                                        {mockTransactions.map((tx) => (
                                            <div
                                                key={tx.desc}
                                                className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/20 transition-colors gap-3"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-lg border border-border/50 shrink-0">
                                                        {tx.icon}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-foreground truncate">
                                                            {tx.category}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {tx.desc}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 shrink-0 text-right">
                                                    <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                                                        {tx.date}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "font-mono font-bold text-sm tracking-tight",
                                                            tx.type === "income"
                                                                ? "text-emerald-600 dark:text-emerald-400"
                                                                : "text-rose-600 dark:text-rose-400"
                                                        )}
                                                    >
                                                        {tx.amount}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* View 2: Category Channels View */
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {mockCategories.map((cat) => (
                                        <div
                                            key={cat.name}
                                            className="p-3.5 rounded-xl border border-border/70 bg-background/50 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-lg border border-border/50 shrink-0">
                                                    {cat.icon}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-foreground truncate">
                                                        {cat.name}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {cat.count}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={cn(
                                                    "font-mono text-xs font-bold shrink-0",
                                                    cat.type === "income"
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-rose-600 dark:text-rose-400"
                                                )}
                                            >
                                                {cat.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
