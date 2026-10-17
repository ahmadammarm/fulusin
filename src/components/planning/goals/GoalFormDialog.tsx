"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, parseISO, startOfToday } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AmountInput from "@/components/planning/AmountInput";
import FormDialogFooter from "@/components/planning/FormDialogFooter";
import { CreateGoalAction, UpdateGoalAction } from "@/actions/goals";
import { GoalUpsertSchema, GoalUpsertSchemaType } from "@/schemas/goals";
import { GoalItem } from "@/app/api/goals/route";
import { formatWibDate } from "@/lib/dateHelper";
import { cn } from "@/lib/utils";

interface GoalFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    goal?: GoalItem;
    trigger?: React.ReactNode;
}

export default function GoalFormDialog({ open, setOpen, goal, trigger }: GoalFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xl">
                <DialogHeader className="space-y-1.5 text-left border-b border-border/60 pb-4 pr-8">
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        {goal ? "Edit Goal" : "New Savings Goal"}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        Name what you are saving for, how much you need, and optionally when.
                    </DialogDescription>
                </DialogHeader>
                <GoalForm goal={goal} onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

interface GoalFormProps {
    goal?: GoalItem;
    onSaved: () => void;
}

function GoalForm({ goal, onSaved }: GoalFormProps) {
    const form = useForm<GoalUpsertSchemaType>({
        resolver: zodResolver(GoalUpsertSchema),
        defaultValues: {
            name: goal?.name ?? "",
            targetAmount: goal?.targetAmount ?? 0,
            deadline: goal?.deadline ? formatWibDate(goal.deadline) : undefined,
        },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: (values: GoalUpsertSchemaType) =>
            goal ? UpdateGoalAction({ ...values, id: goal.id }) : CreateGoalAction(values),
        onSuccess: async (saved) => {
            toast.success(`Goal "${saved.name}" saved`, { id: "upsert-goal" });
            await queryClient.invalidateQueries({ queryKey: ["goals"] });
            onSaved();
        },
        onError: (error: Error) => {
            toast.error(`Failed to save goal: ${error.message}`, { id: "upsert-goal" });
        },
    });

    return (
        <Form {...form}>
            <form className="space-y-4 pt-2" onSubmit={form.handleSubmit((values) => mutate(values))}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">
                                Goal Name <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. Emergency fund, New laptop, Holiday"
                                    className="h-10 text-xs sm:text-sm bg-background border-border/80"
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">
                                Target Amount <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <AmountInput value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">Deadline</FormLabel>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "flex-1 h-10 px-3 bg-card border-border/80 text-xs sm:text-sm font-normal justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <span>{field.value ? format(parseISO(field.value), "PPP") : "No deadline"}</span>
                                                <CalendarIcon className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? parseISO(field.value) : undefined}
                                            disabled={{ before: startOfToday() }}
                                            onSelect={(value) => field.onChange(value ? format(value, "yyyy-MM-dd") : undefined)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {field.value && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 border-border/80 shrink-0"
                                        aria-label="Clear deadline"
                                        onClick={() => field.onChange(undefined)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormDialogFooter
                    isPending={isPending}
                    submitLabel={goal ? "Save Changes" : "Create Goal"}
                    pendingLabel="Saving..."
                />
            </form>
        </Form>
    );
}
