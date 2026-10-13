"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

// Dynamically import 3D Canvas to guarantee clean SSR compatibility
const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[360px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border border-teal-500/20 bg-teal-500/5 animate-pulse" />
        </div>
    ),
});

export default function Hero() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mockupView, setMockupView] = useState<"ledger" | "categories">("ledger");

    // 3D Parallax Tilt for the Ledger Card
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
    const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleCTA = () => {
        if (status === "authenticated" && session?.user?.id) {
            router.push("/dashboard");
        } else {
            router.push("/sign-up");
        }
    };

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
    ];

    const mockCategories = [
        { name: "Salary & Retainers", icon: "💼", type: "income", count: "2 entries", total: "+$8,450.00" },
        { name: "Groceries & Food", icon: "🥑", type: "expense", count: "14 entries", total: "-$840.20" },
        { name: "Software & Cloud", icon: "💻", type: "expense", count: "6 entries", total: "-$320.00" },
        { name: "Rent & Utilities", icon: "🏠", type: "expense", count: "2 entries", total: "-$1,650.00" },
        { name: "Investments", icon: "📊", type: "income", count: "4 entries", total: "+$420.00" },
        { name: "Travel & Transport", icon: "✈️", type: "expense", count: "8 entries", total: "-$310.30" },
    ];

    // Framer Motion Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.05,
            },
        },
    };

    const itemFadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    const cardEntrance = {
        hidden: { opacity: 0, scale: 0.94, y: 32 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 },
        },
    };

    return (
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-32 bg-background">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-teal-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-32 left-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute top-48 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 sm:px-6">
                {/* Hero Header Content with Framer Motion Orchestration */}
                <motion.div
                    className="text-center max-w-4xl mx-auto space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Main Headline */}
                    <motion.h1
                        variants={itemFadeUp}
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:leading-[1.12]"
                    >
                        Master your cash flow,{" "}
                        <span className="relative inline-block bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            period by period.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemFadeUp}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Stop wrestling with rigid spreadsheets. Fulusin combines atomic pre-aggregated history,
                        custom category channels, and multi-currency tracking into one high-speed financial ledger.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemFadeUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.025 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 gap-2 cursor-pointer transition-all"
                                onClick={handleCTA}
                            >
                                <span>Start Tracking Free</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.025 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-medium border-border/80 text-foreground hover:bg-muted/50 gap-2 cursor-pointer transition-all backdrop-blur-xs"
                                onClick={() => {
                                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                <span>Explore Features</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* 3D Showcase & Interactive Ledger Mockup Section */}
                <div className="mt-12 sm:mt-16 max-w-6xl mx-auto relative">
                    {/* Embedded 3D Canvas in Background Depth */}
                    <div className="absolute inset-0 -top-16 sm:-top-20 z-0 opacity-80 pointer-events-none flex items-center justify-center">
                        <Hero3DCanvas />
                    </div>

                    {/* Interactive 3D Parallax Glass Ledger Mockup */}
                    <motion.div
                        variants={cardEntrance}
                        initial="hidden"
                        animate="visible"
                        style={{
                            rotateX,
                            rotateY,
                            transformPerspective: 1200,
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="relative z-10 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/85 dark:bg-card/90 shadow-2xl backdrop-blur-xl overflow-hidden transition-shadow duration-300 hover:shadow-teal-500/10"
                    >
                        {/* Dynamic Interactive Glare Overlay */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 -z-0"
                            style={{
                                background: `radial-gradient(600px circle at ${glareX}% ${glareY}%, rgba(45, 212, 191, 0.12), transparent 40%)`,
                            }}
                        />

                        {/* Mockup Window Titlebar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border/60 bg-muted/40 text-xs relative z-10">
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
                                <Badge variant="outline" className="font-mono text-[11px] bg-background/80 border-border/80">
                                    Period: October 2026
                                </Badge>
                                <Badge variant="outline" className="font-mono text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30">
                                    Currency: USD ($)
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
                            {/* Mockup KPI Metric Cards with Hover Depth */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <motion.div
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    className="p-4 rounded-xl border border-border/70 bg-background/60 shadow-2xs backdrop-blur-xs"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Total Records
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">
                                        142
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Recorded entries
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    className="p-4 rounded-xl border border-border/70 bg-background/60 shadow-2xs backdrop-blur-xs"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                        Total Inflow
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                                        +$8,450.00
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        6 income channels
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    className="p-4 rounded-xl border border-border/70 bg-background/60 shadow-2xs backdrop-blur-xs"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                        Total Outflow
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                                        -$3,120.50
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        28 expense records
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 shadow-2xs backdrop-blur-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                            Net Cash Flow
                                        </p>
                                        <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
                                    </div>
                                    <p className="text-xl sm:text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-1">
                                        +$5,329.50
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Positive trajectory
                                    </p>
                                </motion.div>
                            </div>

                            {/* Mockup Interactive Navigation Tabs with Framer Motion Sliding Pill */}
                            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                <div className="inline-flex h-9 items-center rounded-lg bg-muted/60 p-1 text-muted-foreground text-xs font-medium relative">
                                    <button
                                        type="button"
                                        onClick={() => setMockupView("ledger")}
                                        className={cn(
                                            "relative z-10 rounded-md px-3 py-1 transition-colors",
                                            mockupView === "ledger" ? "text-foreground font-semibold" : "hover:text-foreground"
                                        )}
                                    >
                                        {mockupView === "ledger" && (
                                            <motion.div
                                                layoutId="mockup-tab-indicator"
                                                className="absolute inset-0 bg-background rounded-md shadow-2xs -z-10"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        Live Ledger View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMockupView("categories")}
                                        className={cn(
                                            "relative z-10 rounded-md px-3 py-1 transition-colors",
                                            mockupView === "categories" ? "text-foreground font-semibold" : "hover:text-foreground"
                                        )}
                                    >
                                        {mockupView === "categories" && (
                                            <motion.div
                                                layoutId="mockup-tab-indicator"
                                                className="absolute inset-0 bg-background rounded-md shadow-2xs -z-10"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        Category Channels
                                    </button>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                                    <span>Real-time ACID Synced</span>
                                </div>
                            </div>

                            {/* View 1: Live Ledger View */}
                            {mockupView === "ledger" ? (
                                <motion.div
                                    key="ledger"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-xl border border-border/60 overflow-hidden bg-background/50"
                                >
                                    <div className="divide-y divide-border/40">
                                        {mockTransactions.map((tx, idx) => (
                                            <motion.div
                                                key={tx.desc}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                                whileHover={{ x: 3, backgroundColor: "rgba(20, 184, 166, 0.04)" }}
                                                className="flex items-center justify-between p-3 sm:p-4 transition-colors gap-3 cursor-default"
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
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                /* View 2: Category Channels View */
                                <motion.div
                                    key="categories"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                                >
                                    {mockCategories.map((cat, idx) => (
                                        <motion.div
                                            key={cat.name}
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.04, duration: 0.3 }}
                                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                                            className="p-3.5 rounded-xl border border-border/70 bg-background/50 flex items-center justify-between hover:border-teal-500/30 transition-colors"
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
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
