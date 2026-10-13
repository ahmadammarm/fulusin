"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface FAQItem {
    question: string;
    answer: string;
}

const FAQS: FAQItem[] = [
    {
        question: "How is Fulusin different from standard budgeting apps or spreadsheets?",
        answer:
            "Spreadsheets quickly become sluggish and vulnerable to broken formulas as your data grows. Meanwhile, most consumer budgeting apps force rigid envelope models or sell anonymized user spending data. Fulusin operates as a precision personal financial engine on PostgreSQL: every entry is atomically recorded with zero formulas to break, zero latency, and zero data selling.",
    },
    {
        question: "What is pre-aggregated history and why does it make charts instant?",
        answer:
            "Traditional apps run expensive SUM and GROUP BY SQL queries across thousands of historical transaction rows every time you open a dashboard. Fulusin maintains synchronized daily and monthly aggregation tables (MonthHistory and YearHistory) in the same ACID database transaction that creates or deletes an entry. This turns slow O(N) database scans into instantaneous O(1) reads.",
    },
    {
        question: "Can I import historical bank statements via CSV?",
        answer:
            "Yes. Fulusin includes a bulk CSV ingestion pipeline. You can upload statements exported from any bank, map your dates, amounts, categories, and descriptions, and safely batch-process hundreds of transactions in seconds with automated validation guards.",
    },
    {
        question: "How is my personal financial data protected?",
        answer:
            "Your financial ledger is housed in a private PostgreSQL database protected by session authentication. Fulusin does not sell, harvest, or monetize your transaction data for third-party advertising brokers. You retain full data sovereignty and can export your full transaction records to CSV at any time.",
    },
    {
        question: "Can I customize my currency and category channels?",
        answer:
            "Yes. You select your home currency during the onboarding wizard and can update it anytime in settings. Fulusin formats amounts to match native locale rules (USD, IDR, EUR, JPY, GBP, and more). You also have complete freedom to create, edit, and organize custom income and expense categories with custom icons.",
    },
    {
        question: "How does timezone normalization prevent date-shift bugs?",
        answer:
            "When dealing with transactions recorded late at night, UTC-only databases often misclassify records into the wrong day or month. Fulusin anchors all transaction aggregation points to your regional reference timezone (Asia/Jakarta standard) before extracting day, month, and year values for historical records.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    return (
        <section id="faq" className="py-20 md:py-28 bg-background border-b border-border/60 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-b from-teal-500/5 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto space-y-4 mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Frequently Asked{" "}
                        <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Direct answers to common questions about Fulusin&apos;s ledger design, data privacy, and daily workflows.
                    </p>
                </motion.div>

                {/* Accordion Container with Staggered Viewport Entrance */}
                <motion.div
                    className="max-w-3xl mx-auto space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {FAQS.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={faq.question}
                                variants={itemVariants}
                                whileHover={{ y: -1 }}
                                className={cn(
                                    "rounded-xl border transition-all duration-200 overflow-hidden",
                                    isOpen
                                        ? "border-teal-500/50 bg-card shadow-md shadow-teal-500/5"
                                        : "border-border/80 bg-card/60 hover:border-border hover:bg-card"
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground focus:outline-hidden cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span className={cn(isOpen && "text-teal-600 dark:text-teal-400 transition-colors")}>
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className="shrink-0"
                                    >
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 transition-colors",
                                                isOpen ? "text-teal-500" : "text-muted-foreground"
                                            )}
                                        />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
