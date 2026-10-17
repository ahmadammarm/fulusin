"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, parseISO, startOfToday } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, CalendarIcon } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryPicker from "@/components/CategoryPicker";
import AmountInput from "@/components/planning/AmountInput";
import FormDialogFooter from "@/components/planning/FormDialogFooter";
import { describeRecordedCount, invalidateLedgerQueries } from "@/components/planning/recurring/invalidateLedgerQueries";
import { CreateRecurringTransactionAction } from "@/actions/recurring";
import { RecurringCreateSchema, RecurringCreateSchemaType } from "@/schemas/recurring";
import { RECURRING_FREQUENCIES, RECURRING_FREQUENCY_LABELS } from "@/lib/recurring";
import { formatWibDate } from "@/lib/dateHelper";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RecurringFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export default function RecurringFormDialog({ open, setOpen, trigger }: RecurringFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xl max-h-[92vh] overflow-y-auto">
                <DialogHeader className="space-y-1.5 text-left border-b border-border/60 pb-4 pr-8">
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        New Recurring Transaction
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        A transaction is recorded automatically on each due date and counts toward your balance.
                    </DialogDescription>
                </DialogHeader>
                <RecurringForm onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

function RecurringForm({ onSaved }: { onSaved: () => void }) {
    const form = useForm<RecurringCreateSchemaType>({
        resolver: zodResolver(RecurringCreateSchema),
        defaultValues: {
            type: "expense",
            amount: 0,
            category: "",
            description: "",
            frequency: "monthly",
            startDate: formatWibDate(new Date()),
        },
    });

    const type = form.watch("type");

    const handleTypeChange = (value: string) => {
        form.setValue("type", value as TransactionType);
        form.setValue("category", "");
    };

    const handleCategoryChange = useCallback(
        (category: string) => form.setValue("category", category, { shouldValidate: true }),
        [form]
    );

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: CreateRecurringTransactionAction,
        onSuccess: async ({ processedCount }) => {
            toast.success("Recurring transaction scheduled", {
                id: "create-recurring",
                description: processedCount > 0 ? describeRecordedCount(processedCount) : undefined,
            });
            await invalidateLedgerQueries(queryClient);
            onSaved();
        },
        onError: (error: Error) => {
            toast.error(`Failed to schedule: ${error.message}`, { id: "create-recurring" });
        },
    });

    return (
        <Form {...form}>
            <form className="space-y-4 pt-2" onSubmit={form.handleSubmit((values) => mutate(values))}>
                <Tabs value={type} onValueChange={handleTypeChange}>
                    <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl">
                        <TabsTrigger
                            value="expense"
                            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2"
                        >
                            <ArrowUpRight className="h-4 w-4 text-rose-500 shrink-0" />
                            <span>Expense</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="income"
                            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs text-xs sm:text-sm font-medium gap-2"
                        >
                            <ArrowDownLeft className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>Income</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

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

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">Description</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. Salary, Rent, Streaming subscription"
                                    className="h-10 text-xs sm:text-sm bg-background border-border/80"
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold text-foreground">
                                    Category <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    {/* Remount on type change so the picker drops the previous type's selection. */}
                                    <CategoryPicker key={type} type={type} value={field.value} onChange={handleCategoryChange} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold text-foreground">
                                    Repeats <span className="text-rose-500">*</span>
                                </FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full h-10 bg-card border-border/80 text-xs sm:text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {RECURRING_FREQUENCIES.map((frequency) => (
                                            <SelectItem key={frequency} value={frequency} className="text-xs sm:text-sm">
                                                {RECURRING_FREQUENCY_LABELS[frequency]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-xs font-semibold text-foreground">
                                First Date <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full h-10 px-3 bg-card border-border/80 text-xs sm:text-sm font-normal justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <span>{field.value ? format(parseISO(field.value), "PPP") : "Select date"}</span>
                                            <CalendarIcon className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? parseISO(field.value) : undefined}
                                        disabled={{ before: startOfToday() }}
                                        onSelect={(value) => value && field.onChange(format(value, "yyyy-MM-dd"))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-[11px] text-muted-foreground">
                                Choosing today records the first transaction right away.
                            </p>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormDialogFooter isPending={isPending} submitLabel="Schedule" pendingLabel="Scheduling..." />
            </form>
        </Form>
    );
}
