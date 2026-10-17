"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AmountInput from "@/components/planning/AmountInput";
import FormDialogFooter from "@/components/planning/FormDialogFooter";
import { UpdateGoalFundsAction } from "@/actions/goals";
import { GoalFundsSchema, GoalFundsSchemaType } from "@/schemas/goals";
import { GoalItem } from "@/app/api/goals/route";

interface GoalFundsDialogProps {
    goal: GoalItem;
    open: boolean;
    setOpen: (open: boolean) => void;
    formatter: Intl.NumberFormat;
}

export default function GoalFundsDialog({ goal, open, setOpen, formatter }: GoalFundsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xl">
                <DialogHeader className="space-y-1.5 text-left border-b border-border/60 pb-4 pr-8">
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                        Update &ldquo;{goal.name}&rdquo;
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        Currently saved: {formatter.format(goal.currentAmount)}. This only changes the goal, not your
                        account balance.
                    </DialogDescription>
                </DialogHeader>
                <GoalFundsForm goal={goal} onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

function GoalFundsForm({ goal, onSaved }: { goal: GoalItem; onSaved: () => void }) {
    const form = useForm<GoalFundsSchemaType>({
        resolver: zodResolver(GoalFundsSchema),
        defaultValues: { id: goal.id, amount: 0, direction: "deposit" },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: UpdateGoalFundsAction,
        onSuccess: async (_, { direction }) => {
            toast.success(direction === "deposit" ? "Funds added to goal" : "Funds withdrawn from goal", {
                id: "goal-funds",
            });
            await queryClient.invalidateQueries({ queryKey: ["goals"] });
            onSaved();
        },
        onError: (error: Error) => {
            toast.error(error.message, { id: "goal-funds" });
        },
    });

    return (
        <Form {...form}>
            <form className="space-y-4 pt-2" onSubmit={form.handleSubmit((values) => mutate(values))}>
                <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                        <Tabs value={field.value} onValueChange={field.onChange}>
                            <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl">
                                <TabsTrigger
                                    value="deposit"
                                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2"
                                >
                                    <ArrowDownToLine className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span>Add funds</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="withdraw"
                                    disabled={goal.currentAmount <= 0}
                                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2"
                                >
                                    <ArrowUpFromLine className="h-4 w-4 text-rose-500 shrink-0" />
                                    <span>Withdraw</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">
                                Amount <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <AmountInput value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormDialogFooter isPending={isPending} submitLabel="Confirm" pendingLabel="Updating..." />
            </form>
        </Form>
    );
}
