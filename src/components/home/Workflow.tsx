"use client"

import { Coins, Database, FileSpreadsheet, LineChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
    ]

    return (
        <section id="workflow" className="py-20 md:py-28 bg-background border-b border-border/60">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <span>Seamless 4-Step Process</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        From raw transactions to{" "}
                        <span className="text-teal-600 dark:text-teal-400">
                            crystal clear financial vision.
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        How Fulusin turns daily receipts and bank exports into an audit-ready financial ledger in seconds.
                    </p>
                </div>

                {/* Workflow Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {steps.map((step) => {
                        const Icon = step.icon
                        return (
                            <div
                                key={step.number}
                                className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between relative group hover:border-teal-500/40 transition-all duration-300 shadow-sm"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-2xl font-black font-mono text-muted-foreground/40 group-hover:text-teal-500/60 transition-colors">
                                            {step.number}
                                        </span>
                                    </div>

                                    <Badge variant="outline" className="text-[10px] font-mono border-border mb-2.5">
                                        {step.badge}
                                    </Badge>

                                    <h3 className="text-lg font-bold text-foreground mb-2">
                                        {step.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/60">
                                    <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                        {step.metric}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
