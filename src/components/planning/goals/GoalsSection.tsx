"use client";

import { Suspense, useState } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoalFormDialog from "@/components/planning/goals/GoalFormDialog";
import GoalList from "@/components/planning/goals/GoalList";
import { GoalListSkeleton } from "@/components/skeletons/PlanningSkeleton";

export default function GoalsSection() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Savings Goals</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Set targets and track how close you are to each one.
                            </p>
                        </div>
                    </div>

                    <GoalFormDialog
                        open={isCreateOpen}
                        setOpen={setIsCreateOpen}
                        trigger={
                            <Button className="h-10 gap-2 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs self-start sm:self-auto">
                                <Plus className="h-4 w-4" />
                                <span>New Goal</span>
                            </Button>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <Suspense fallback={<GoalListSkeleton />}>
                    <GoalList />
                </Suspense>
            </CardContent>
        </Card>
    );
}
