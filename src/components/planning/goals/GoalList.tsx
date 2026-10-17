"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import GoalCard from "@/components/planning/goals/GoalCard";
import PlanningEmptyState from "@/components/planning/PlanningEmptyState";
import { GetGoalsResponseType } from "@/app/api/goals/route";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter";

export default function GoalList() {
    const { formatter } = useCurrencyFormatter();

    const { data: goals } = useSuspenseQuery<GetGoalsResponseType>({
        queryKey: ["goals"],
        queryFn: async () => {
            const response = await fetch("/api/goals");
            if (!response.ok) {
                throw new Error("Failed to fetch goals");
            }
            return response.json();
        },
    });

    if (goals.length === 0) {
        return (
            <PlanningEmptyState
                icon={Target}
                title="No savings goals yet"
                description="Create a goal for something you're saving toward and track your progress as you set money aside."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} formatter={formatter} />
            ))}
        </div>
    );
}
