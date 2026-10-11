"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
    question: string
    answer: string
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
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggle = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx))
    }

    return (
        <section id="faq" className="py-20 md:py-28 bg-background border-b border-border/60">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <span>Transparent Financial Architecture</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Frequently Asked{" "}
                        <span className="text-teal-600 dark:text-teal-400">
                            Questions
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Direct answers to common questions about Fulusin&apos;s ledger design, data privacy, and daily workflows.
                    </p>
                </div>

                {/* Accordion Container */}
                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQS.map((faq, idx) => {
                        const isOpen = openIndex === idx
                        return (
                            <div
                                key={faq.question}
                                className={cn(
                                    "rounded-xl border transition-all duration-200 overflow-hidden",
                                    isOpen
                                        ? "border-teal-500/40 bg-card shadow-sm"
                                        : "border-border/80 bg-card/60 hover:border-border"
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground focus:outline-hidden"
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                                            isOpen && "rotate-180 text-teal-500"
                                        )}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
