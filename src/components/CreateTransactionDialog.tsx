/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TransactionType } from "@/lib/types";
import { ReactNode, useCallback, useMemo, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransactionAction } from "@/actions/transactions";
import { toast } from "sonner";
import { Currencies } from "@/lib/currencies";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
    currency?: string;
}

export default function CreateTransactionDialog({ trigger, type, currency = "USD" }: Props) {
    const [open, setOpen] = useState(false);
    const isIncome = type === "income";

    const currencyLabel = useMemo(() => {
        if (!currency) return "USD";
        const found = Currencies.find((c) => c.value === currency);
        if (found) {
            const symbol = found.label.split(" ")[0];
            return symbol || currency;
        }
        return currency;
    }, [currency]);

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            amount: 0,
            description: "",
            date: format(new Date(), "yyyy-MM-dd"),
            category: "",
        },
    });

    const handleCategoryChange = useCallback(
        (category: string) => {
            form.setValue("category", category, { shouldValidate: true });
        },
        [form]
    );

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransactionAction,
        onMutate: () => {
            toast.loading("Recording transaction...", {
                id: "create-transaction",
            });
            setOpen(false);
        },
        onSuccess: () => {
            toast.success(
                `${isIncome ? "Income" : "Expense"} transaction recorded!`,
                {
                    id: "create-transaction",
                }
            );

            form.reset({
                amount: 0,
                description: "",
                date: format(new Date(), "yyyy-MM-dd"),
                category: "",
                type,
            });

            queryClient.invalidateQueries({
                queryKey: ["overview"],
                exact: false,
            });

            queryClient.invalidateQueries({
                queryKey: ["transactionHistory"],
            });
        },
        onError: (error: Error) => {
            toast.error(`Failed to record transaction: ${error.message}`, {
                id: "create-transaction",
            });
        },
    });

    const onSubmit = useCallback(
        (data: CreateTransactionSchemaType) => {
            mutate(data);
        },
        [mutate]
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xl max-h-[92vh] overflow-y-auto">
                <DialogHeader className="space-y-1.5 text-left border-b border-border/60 pb-4 pr-8">
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                        {isIncome ? "New Income" : "New Expense"}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        {isIncome
                            ? "Record incoming cash flow, salary, freelance, or investment payout."
                            : "Record outgoing funds, bills, utilities, or everyday expenditures."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-4 pt-3" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Hero Amount Field with Dynamic User Currency */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                            Amount <span className="text-rose-500">*</span>
                                        </FormLabel>
                                        <span className="text-[11px] text-muted-foreground font-mono">
                                            Currency: {currency}
                                        </span>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-lg bg-muted text-xs font-mono font-bold text-foreground border border-border/80">
                                                    {currencyLabel}
                                                </span>
                                            </div>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="0.00"
                                                className="h-12 sm:h-14 pl-14 sm:pl-16 pr-4 text-xl sm:text-2xl font-mono font-bold tracking-tight bg-muted/20 border-border/80 focus-visible:ring-1"
                                                value={field.value === 0 ? "" : field.value}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    field.onChange(isNaN(val) ? 0 : val);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-xs font-semibold text-foreground">
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Client retainer, Groceries, Cloud hosting"
                                            className="h-10 text-xs sm:text-sm bg-background border-border/80"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Category & Date Pickers in Responsive Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-semibold text-foreground">
                                            Category <span className="text-rose-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <CategoryPicker
                                                type={type}
                                                onChange={handleCategoryChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-semibold text-foreground">
                                            Transaction Date <span className="text-rose-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full h-10 px-3 bg-card border-border/80 text-xs sm:text-sm font-normal justify-between truncate",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="truncate">
                                                            {field.value
                                                                ? format(new Date(field.value), "PPP")
                                                                : "Select date"}
                                                        </span>
                                                        <CalendarIcon className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={new Date(field.value)}
                                                        onSelect={(value) => {
                                                            if (!value) return;
                                                            field.onChange(format(value, "yyyy-MM-dd"));
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Dialog Footer Actions */}
                        <DialogFooter className="pt-4 border-t border-border/60 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    disabled={isPending}
                                    className="w-full sm:w-auto h-10 text-xs sm:text-sm border-border/80"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className={cn(
                                    "w-full sm:w-auto h-10 px-5 text-xs sm:text-sm font-semibold text-white gap-2 shadow-xs",
                                    isIncome
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-rose-600 hover:bg-rose-700"
                                )}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Recording...</span>
                                    </>
                                ) : (
                                    <span>{isIncome ? "Record Income" : "Record Expense"}</span>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
