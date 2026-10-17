"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Repeat } from "lucide-react";
import RecurringCard from "@/components/planning/recurring/RecurringCard";
import PlanningEmptyState from "@/components/planning/PlanningEmptyState";
import { GetRecurringResponseType } from "@/app/api/recurring/route";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter";

export default function RecurringList() {
    const { formatter } = useCurrencyFormatter();

    const { data: rules } = useSuspenseQuery<GetRecurringResponseType>({
        queryKey: ["recurringTransactions"],
        queryFn: async () => {
            const response = await fetch("/api/recurring");
            if (!response.ok) {
                throw new Error("Failed to fetch recurring transactions");
            }
            return response.json();
        },
    });

    if (rules.length === 0) {
        return (
            <PlanningEmptyState
                icon={Repeat}
                title="No recurring transactions yet"
                description="Schedule income or expenses that repeat, like your salary, rent, or subscriptions, and they'll be recorded automatically."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {rules.map((rule) => (
                <RecurringCard key={rule.id} rule={rule} formatter={formatter} />
            ))}
        </div>
    );
}
