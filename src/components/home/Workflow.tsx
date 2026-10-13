"use client";

import { Coins, Database, FileSpreadsheet, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Workflow() {
    const steps = [
        {
            number: "01",
            title: "Select Currency & Locale",
            badge: "Wizard Onboarding",
            icon: Coins,
            description:
                "Configure your home currency during quick setup. Fulusin configures thousand separators, decimal places, and currency notation to your locale.",
            metric: "Over 30 fiat currencies supported",
        },
        {
            number: "02",
            title: "Capture Records or Import CSV",
            badge: "Dual Ingestion",
            icon: FileSpreadsheet,
            description:
                "Record daily transactions on the go or upload months of historical bank statements via high-speed CSV batch processing.",
            metric: "Automatic column mapping & validation",
        },
        {
            number: "03",
            title: "Atomic History Aggregation",
            badge: "PostgreSQL ACID",
            icon: Database,
            description:
                "Every transaction synchronously updates daily and monthly history tables. Zero manual balance audits, zero recalculation lag.",
            metric: "Atomic locks & automatic pruning",
        },
        {
            number: "04",
            title: "Audit Trends & Cash Flow",
            badge: "Period Analytics",
            icon: LineChart,
            description:
                "Switch between monthly and annual views. Visualize income versus expense velocity and maintain positive financial trajectory.",
            metric: "Real-time O(1) query rendering",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.14,
                delayChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 28 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    return (
        <section id="workflow" className="py-20 md:py-28 bg-background border-b border-border/60 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto space-y-4 mb-16"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        From raw transactions to{" "}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                            crystal clear financial vision.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        How Fulusin turns daily receipts and bank exports into an audit-ready financial ledger in seconds.
                    </p>
                </motion.div>

                {/* Flow Indicator Beam on Desktop */}
                <div className="hidden lg:block max-w-6xl mx-auto relative mb-6 px-8">
                    <div className="h-0.5 w-full bg-border/60 relative overflow-hidden rounded-full">
                        <motion.div
                            className="absolute top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-teal-400 to-transparent blur-[1px]"
                            animate={{
                                x: ["-100%", "600%"],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 3.5,
                                ease: "linear",
                            }}
                        />
                    </div>
                </div>

                {/* Workflow Steps Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                variants={cardVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between relative group hover:border-teal-500/40 transition-colors duration-300 shadow-sm hover:shadow-lg hover:shadow-teal-500/5"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/15 transition-all duration-200">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-2xl font-black font-mono text-muted-foreground/35 group-hover:text-teal-500/70 transition-colors">
                                            {step.number}
                                        </span>
                                    </div>

                                    <Badge variant="outline" className="text-[10px] font-mono border-border mb-2.5">
                                        {step.badge}
                                    </Badge>

                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {step.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/60">
                                    <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                                        {step.metric}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
