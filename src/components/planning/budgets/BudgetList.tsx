"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import BudgetCard from "@/components/planning/budgets/BudgetCard";
import BudgetSummary from "@/components/planning/budgets/BudgetSummary";
import PlanningEmptyState from "@/components/planning/PlanningEmptyState";
import { GetBudgetsResponseType } from "@/app/api/budgets/route";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter";
import { Period } from "@/lib/types";

interface BudgetListProps {
    period: Period;
}

export default function BudgetList({ period }: BudgetListProps) {
    const { formatter } = useCurrencyFormatter();

    const { data: budgets } = useSuspenseQuery<GetBudgetsResponseType>({
        queryKey: ["budgets", period.month, period.year],
        queryFn: async () => {
            const response = await fetch(`/api/budgets?month=${period.month}&year=${period.year}`);
            if (!response.ok) {
                throw new Error("Failed to fetch budgets");
            }
            return response.json();
        },
    });

    if (budgets.length === 0) {
        return (
            <PlanningEmptyState
                icon={Wallet}
                title="No budgets for this month"
                description="Create a spending limit for an expense category, or copy last month's budgets to get started."
            />
        );
    }

    return (
        <div className="space-y-5">
            <BudgetSummary budgets={budgets} formatter={formatter} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {budgets.map((budget) => (
                    <BudgetCard key={budget.id} budget={budget} period={period} formatter={formatter} />
                ))}
            </div>
        </div>
    );
}
