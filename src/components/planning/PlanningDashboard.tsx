"use client";

import { Repeat, Target, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlanningHeader from "@/components/planning/PlanningHeader";
import BudgetsSection from "@/components/planning/budgets/BudgetsSection";
import GoalsSection from "@/components/planning/goals/GoalsSection";
import RecurringSection from "@/components/planning/recurring/RecurringSection";

// The Analytics tab (components/planning/analytics/AnalyticsSection) is hidden until its design is reviewed.
const TABS = [
    { value: "budgets", label: "Budgets", icon: Wallet, content: BudgetsSection },
    { value: "goals", label: "Goals", icon: Target, content: GoalsSection },
    { value: "recurring", label: "Recurring", icon: Repeat, content: RecurringSection },
];

export default function PlanningDashboard() {
    return (
        <div className="min-h-full bg-background pb-12">
            <PlanningHeader />

            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <Tabs defaultValue="budgets" className="w-full space-y-4">
                    <TabsList className="grid w-full sm:w-[400px] grid-cols-3 h-10 p-1 bg-muted/60 rounded-xl">
                        {TABS.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-1.5 transition-all"
                            >
                                <Icon className="hidden sm:block h-4 w-4 text-teal-500 shrink-0" />
                                <span>{label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {TABS.map(({ value, content: Section }) => (
                        <TabsContent key={value} value={value} className="mt-0 focus-visible:outline-hidden">
                            <Section />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
