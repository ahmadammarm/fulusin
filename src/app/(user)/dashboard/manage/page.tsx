"use client";

import CategoryList from "@/components/CategoryList";
import CurrencySettingsCard from "@/components/CurrencySettingsCard";
import {
    CategoryListSkeleton,
    CurrencySettingsSkeleton,
} from "@/components/skeletons/ManagePreferencesSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";

export default function ManagePage() {
    return (
        <div className="min-h-full bg-background pb-12">
            {/* Page Header banner */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
                    <Suspense fallback={<CurrencySettingsSkeleton />}>
                        <CurrencySettingsCard />
                    </Suspense>
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
                                </TabsTrigger>

                                <TabsTrigger
                                    value="expense"
                                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2 transition-all"
                                >
                                    <ArrowUpRight className="h-4 w-4 text-rose-500 shrink-0" />
                                    <span>Expense</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="income" className="mt-0 focus-visible:outline-hidden">
                            <Suspense fallback={<CategoryListSkeleton />}>
                                <CategoryList type="income" />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="expense" className="mt-0 focus-visible:outline-hidden">
                            <Suspense fallback={<CategoryListSkeleton />}>
                                <CategoryList type="expense" />
                            </Suspense>
                        </TabsContent>
                    </Tabs>
                </section>
            </div>
        </div>
    );
}
