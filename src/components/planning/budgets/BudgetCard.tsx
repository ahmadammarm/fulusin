"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BudgetFormDialog from "@/components/planning/budgets/BudgetFormDialog";
import ConfirmDeleteDialog from "@/components/planning/ConfirmDeleteDialog";
import { DeleteBudgetAction } from "@/actions/budgets";
import { BudgetWithProgress } from "@/app/api/budgets/route";
import { BUDGET_STATUS_STYLES, getBudgetProgress } from "@/lib/planning";
import { Period } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
    budget: BudgetWithProgress;
    period: Period;
    formatter: Intl.NumberFormat;
}

export default function BudgetCard({ budget, period, formatter }: BudgetCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { percentage, remaining, status } = getBudgetProgress(budget.spent, budget.amount);
    const styles = BUDGET_STATUS_STYLES[status];

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: DeleteBudgetAction,
        onSuccess: async () => {
            toast.success(`Budget for "${budget.category}" deleted`, { id: budget.id });
            await queryClient.invalidateQueries({ queryKey: ["budgets"] });
            setIsDeleteOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete budget: ${error.message}`, { id: budget.id });
        },
    });

    return (
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 border border-border/50 text-lg shrink-0">
                    {budget.categoryIcon || "🏷️"}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{budget.category}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                        {formatter.format(budget.spent)} of {formatter.format(budget.amount)}
                    </p>
                </div>
                <Badge variant="secondary" className={cn("text-[11px] px-2 py-0.5 border shrink-0", styles.badge)}>
                    {styles.label}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Open budget actions</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem className="flex items-center gap-2 text-xs cursor-pointer" onSelect={() => setIsEditOpen(true)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit limit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive flex items-center gap-2 text-xs cursor-pointer"
                            onSelect={() => setIsDeleteOpen(true)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Progress value={Math.min(percentage, 100)} indicator={styles.indicator} className="bg-muted" />

            <div className="flex items-center justify-between text-xs">
                <span className={cn("font-medium", styles.text)}>
                    {remaining >= 0
                        ? `${formatter.format(remaining)} left`
                        : `${formatter.format(Math.abs(remaining))} over`}
                </span>
                <span className="text-muted-foreground font-mono">{percentage}%</span>
            </div>

            <BudgetFormDialog period={period} budget={budget} open={isEditOpen} setOpen={setIsEditOpen} />
            <ConfirmDeleteDialog
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                title="Delete Budget"
                description={`Remove the "${budget.category}" spending limit for this month? Your transactions are not affected.`}
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate({ id: budget.id })}
            />
        </div>
    );
}
