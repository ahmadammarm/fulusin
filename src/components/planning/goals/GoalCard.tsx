"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarClock, CheckCircle2, MoreHorizontal, Pencil, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoalFormDialog from "@/components/planning/goals/GoalFormDialog";
import GoalFundsDialog from "@/components/planning/goals/GoalFundsDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { DeleteGoalAction } from "@/actions/goals";
import { GoalItem } from "@/app/api/goals/route";
import { getGoalProgress } from "@/lib/planning";
import { cn } from "@/lib/utils";

interface GoalCardProps {
    goal: GoalItem;
    formatter: Intl.NumberFormat;
}

function describeDeadline(deadline: string, daysLeft: number): string {
    const date = format(new Date(deadline), "MMM d, yyyy");
    if (daysLeft < 0) return `Overdue since ${date}`;
    if (daysLeft === 0) return "Due today";
    return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left · ${date}`;
}

export default function GoalCard({ goal, formatter }: GoalCardProps) {
    const [isFundsOpen, setIsFundsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { percentage, remaining, isCompleted, daysLeft } = getGoalProgress(
        goal.currentAmount,
        goal.targetAmount,
        goal.deadline
    );
    const isOverdue = !isCompleted && daysLeft !== null && daysLeft < 0;

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: DeleteGoalAction,
        onSuccess: async () => {
            toast.success(`Goal "${goal.name}" deleted`, { id: goal.id });
            await queryClient.invalidateQueries({ queryKey: ["goals"] });
            setIsDeleteOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete goal: ${error.message}`, { id: goal.id });
        },
    });

    return (
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs gap-4">
            <div className="flex items-start gap-3">
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl border shrink-0",
                        isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                    )}
                >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{goal.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                        {formatter.format(goal.currentAmount)} of {formatter.format(goal.targetAmount)}
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Open goal actions</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem className="flex items-center gap-2 text-xs cursor-pointer" onSelect={() => setIsEditOpen(true)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit goal</span>
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

            <div className="space-y-2">
                <Progress
                    value={percentage}
                    indicator={isCompleted ? "bg-emerald-500" : "bg-teal-500"}
                    className="bg-muted"
                />
                <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                        {isCompleted ? "Goal reached" : `${formatter.format(remaining)} to go`}
                    </span>
                    <span className="text-muted-foreground font-mono">{percentage}%</span>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border/50">
                <span
                    className={cn(
                        "flex items-center gap-1.5 text-[11px] min-w-0",
                        isOverdue ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                    )}
                >
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                        {goal.deadline && daysLeft !== null ? describeDeadline(goal.deadline, daysLeft) : "No deadline"}
                    </span>
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0 border-border/80 hover:text-teal-600 hover:border-teal-500"
                    onClick={() => setIsFundsOpen(true)}
                >
                    Update funds
                </Button>
            </div>

            <GoalFundsDialog goal={goal} open={isFundsOpen} setOpen={setIsFundsOpen} formatter={formatter} />
            <GoalFormDialog goal={goal} open={isEditOpen} setOpen={setIsEditOpen} />
            <ConfirmDeleteDialog
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                title={`Delete "${goal.name}"?`}
                description="The goal and its saved progress will be removed. Your account balance isn't affected. This can't be undone."
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate({ id: goal.id })}
            />
        </div>
    );
}
