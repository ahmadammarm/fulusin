"use client";

import { Suspense, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Loader2, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BudgetFormDialog from "@/components/planning/budgets/BudgetFormDialog";
import BudgetList from "@/components/planning/budgets/BudgetList";
import MonthNavigator from "@/components/planning/MonthNavigator";
import { BudgetListSkeleton } from "@/components/skeletons/PlanningSkeleton";
import { CopyPreviousBudgetsAction } from "@/actions/budgets";
import { getCurrentWibPeriod } from "@/lib/dateHelper";
import { Period } from "@/lib/types";

export default function BudgetsSection() {
    const [period, setPeriod] = useState<Period>(getCurrentWibPeriod);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const queryClient = useQueryClient();
    const copyMutation = useMutation({
        mutationFn: CopyPreviousBudgetsAction,
        onSuccess: async ({ previousCount, copiedCount }) => {
            if (previousCount === 0) {
                toast.info("Last month has no budgets to copy", {
                    id: "copy-budgets",
                    description: "Create a budget with \"New Budget\" instead.",
                });
                return;
            }

            toast.success(
                copiedCount > 0
                    ? `Copied ${copiedCount} budget${copiedCount === 1 ? "" : "s"} from last month`
                    : "All of last month's budgets already exist this month",
                { id: "copy-budgets" }
            );
            await queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
        onError: (error: Error) => {
            toast.error(error.message, { id: "copy-budgets" });
        },
    });

    return (
        <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Monthly Budgets</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Track spending against limits for each expense category.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <MonthNavigator period={period} onChange={setPeriod} />
                        <Button
                            variant="outline"
                            className="h-10 gap-2 text-xs sm:text-sm border-border/80"
                            disabled={copyMutation.isPending}
                            onClick={() => copyMutation.mutate(period)}
                        >
                            {copyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                            <span>Copy last month</span>
                        </Button>
                        <BudgetFormDialog
                            period={period}
                            open={isCreateOpen}
                            setOpen={setIsCreateOpen}
                            trigger={
                                <Button className="h-10 gap-2 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs">
                                    <Plus className="h-4 w-4" />
                                    <span>New Budget</span>
                                </Button>
                            }
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <Suspense fallback={<BudgetListSkeleton />}>
                    <BudgetList period={period} />
                </Suspense>
            </CardContent>
        </Card>
    );
}
