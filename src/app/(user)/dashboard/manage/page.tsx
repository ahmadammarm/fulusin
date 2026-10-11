"use client"

import CategoryList from "@/components/CategoryList"
import CurrencySettingsCard from "@/components/CurrencySettingsCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, SlidersHorizontal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function ManagePage() {
    const incomeCategoriesQuery = useQuery({
        queryKey: ["categories", "income"],
        queryFn: async () => {
            const res = await axios.get("/api/categories?type=income")
            return res.data
        },
    })

    const expenseCategoriesQuery = useQuery({
        queryKey: ["categories", "expense"],
        queryFn: async () => {
            const res = await axios.get("/api/categories?type=expense")
            return res.data
        },
    })

    const incomeCount = incomeCategoriesQuery.data?.length ?? 0
    const expenseCount = expenseCategoriesQuery.data?.length ?? 0

    return (
        <div className="min-h-full bg-background pb-12">
            {/* Page Header banner with mobile navbar clearance */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 pt-20 md:pt-10 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    Manage Preferences
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
                                Configure your primary currency, financial format rules, and categorized income and expense channels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
                {/* Section 1: Currency Settings Card with Live Preview */}
                <section>
                    <CurrencySettingsCard />
                </section>

                {/* Section 2: Tabbed Category Management */}
                <section className="space-y-4">
                    <Tabs defaultValue="income" className="w-full space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                                    Transaction Categories
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Switch between your income and expense category sets.
                                </p>
                            </div>

                            <TabsList className="grid w-full sm:w-[380px] grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl">
                                <TabsTrigger
                                    value="income"
                                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2 transition-all"
                                >
                                    <ArrowDownLeft className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span>Income</span>
                                    <Badge
                                        variant="secondary"
                                        className="px-1.5 py-0 text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    >
                                        {incomeCount}
                                    </Badge>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="expense"
                                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2 transition-all"
                                >
                                    <ArrowUpRight className="h-4 w-4 text-rose-500 shrink-0" />
                                    <span>Expense</span>
                                    <Badge
                                        variant="secondary"
                                        className="px-1.5 py-0 text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                    >
                                        {expenseCount}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="income" className="mt-0 focus-visible:outline-hidden">
                            <CategoryList type="income" />
                        </TabsContent>

                        <TabsContent value="expense" className="mt-0 focus-visible:outline-hidden">
                            <CategoryList type="expense" />
                        </TabsContent>
                    </Tabs>
                </section>
            </div>
        </div>
    )
}
