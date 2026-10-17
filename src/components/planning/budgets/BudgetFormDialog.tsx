"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CategoryPicker from "@/components/CategoryPicker";
import AmountInput from "@/components/planning/AmountInput";
import FormDialogFooter from "@/components/planning/FormDialogFooter";
import { UpsertBudgetAction } from "@/actions/budgets";
import { BudgetUpsertSchema, BudgetUpsertSchemaType } from "@/schemas/budgets";
import { BudgetWithProgress } from "@/app/api/budgets/route";
import { Period } from "@/lib/types";

interface BudgetFormDialogProps {
    period: Period;
    open: boolean;
    setOpen: (open: boolean) => void;
    budget?: BudgetWithProgress;
    trigger?: React.ReactNode;
}

export default function BudgetFormDialog({ period, open, setOpen, budget, trigger }: BudgetFormDialogProps) {
    const periodLabel = format(new Date(period.year, period.month - 1, 1), "MMMM yyyy");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xl">
                <DialogHeader className="space-y-1.5 text-left border-b border-border/60 pb-4 pr-8">
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        {budget ? "Edit Budget" : "New Budget"}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        Set a spending limit for an expense category in {periodLabel}.
                    </DialogDescription>
                </DialogHeader>
                {/* DialogContent unmounts when closed, so the form starts fresh on every open. */}
                <BudgetForm period={period} budget={budget} onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

interface BudgetFormProps {
    period: Period;
    budget?: BudgetWithProgress;
    onSaved: () => void;
}

function BudgetForm({ period, budget, onSaved }: BudgetFormProps) {
    const form = useForm<BudgetUpsertSchemaType>({
        resolver: zodResolver(BudgetUpsertSchema),
        defaultValues: {
            category: budget?.category ?? "",
            amount: budget?.amount ?? 0,
            month: period.month,
            year: period.year,
        },
    });

    const handleCategoryChange = useCallback(
        (category: string) => form.setValue("category", category, { shouldValidate: true }),
        [form]
    );

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: UpsertBudgetAction,
        onSuccess: async (saved) => {
            toast.success(`Budget for "${saved.category}" saved`, { id: "upsert-budget" });
            await queryClient.invalidateQueries({ queryKey: ["budgets"] });
            onSaved();
        },
        onError: (error: Error) => {
            toast.error(`Failed to save budget: ${error.message}`, { id: "upsert-budget" });
        },
    });

    return (
        <Form {...form}>
            <form className="space-y-4 pt-2" onSubmit={form.handleSubmit((values) => mutate(values))}>
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">
                                Expense Category <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                {budget ? (
                                    <div className="flex h-10 items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 text-xs sm:text-sm">
                                        <span>{budget.categoryIcon}</span>
                                        <span>{field.value}</span>
                                    </div>
                                ) : (
                                    <CategoryPicker type="expense" value={field.value} onChange={handleCategoryChange} />
                                )}
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">
                                Monthly Limit <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <AmountInput value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormDialogFooter
                    isPending={isPending}
                    submitLabel={budget ? "Save Changes" : "Create Budget"}
                    pendingLabel="Saving..."
                />
            </form>
        </Form>
    );
}
