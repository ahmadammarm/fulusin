"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDeleteDialog from "@/components/planning/ConfirmDeleteDialog";
import { DeleteRecurringTransactionAction } from "@/actions/recurring";
import { RecurringItem } from "@/app/api/recurring/route";
import { RECURRING_FREQUENCY_LABELS } from "@/lib/recurring";
import { formatWibDate } from "@/lib/dateHelper";
import { cn } from "@/lib/utils";

interface RecurringCardProps {
    rule: RecurringItem;
    formatter: Intl.NumberFormat;
}

export default function RecurringCard({ rule, formatter }: RecurringCardProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const isIncome = rule.type === "income";
    const label = rule.description || rule.category;

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: DeleteRecurringTransactionAction,
        onSuccess: async () => {
            toast.success(`"${label}" will no longer repeat`, { id: rule.id });
            await queryClient.invalidateQueries({ queryKey: ["recurringTransactions"] });
            setIsDeleteOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`, { id: rule.id });
        },
    });

    return (
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs gap-4">
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 border border-border/50 text-lg shrink-0">
                    {rule.categoryIcon || "🏷️"}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{label}</p>
                    <p className="text-xs text-muted-foreground truncate">{rule.category}</p>
                </div>
                <span
                    className={cn(
                        "text-sm font-bold font-mono shrink-0",
                        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}
                >
                    {isIncome ? "+" : "-"}
                    {formatter.format(rule.amount)}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Open recurring actions</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
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

            <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border/50">
                <Badge variant="secondary" className="text-[11px] px-2 py-0.5 border bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                    {RECURRING_FREQUENCY_LABELS[rule.frequency]}
                </Badge>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Next on {formatWibDate(rule.nextDate, "MMM d, yyyy")}</span>
                </span>
            </div>

            <ConfirmDeleteDialog
                open={isDeleteOpen}
                setOpen={setIsDeleteOpen}
                title="Delete Schedule"
                description={`Stop repeating "${label}"? Transactions already recorded stay in your history.`}
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate({ id: rule.id })}
            />
        </div>
    );
}
