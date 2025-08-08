"use client"

import { TransactionType } from "@/lib/types";
import { ReactNode, useCallback, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
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
import { DatetoUTCDate } from "@/lib/dateHelper";

interface Props {
    trigger: ReactNode;
    type: TransactionType
}

export default function CreateTransactionDialog({ trigger, type }: Props) {

    const [open, setOpen] = useState(false)

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
        },
    })

    const handleCategoryChange = useCallback((category: string) => {
        form.setValue("category", category);
    }, [form]);


    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransactionAction,
        onSuccess: () => {
            toast.success("Transaction created successfully!", {
                id: "create-transaction-success"
            });

            form.reset({
                amount: 0,
                description: '',
                date: new Date(),
                category: '',
                type
            });

            queryClient.invalidateQueries({
                queryKey: ['overview', 'statistics', form.getValues("date")]
            });

            setOpen(prev => !prev);
        }
    });

    const onSubmit = useCallback((data: CreateTransactionSchemaType) => {
        mutate({
            ...data,
            date: DatetoUTCDate(data.date)
        });
    }, [mutate]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-5">
                    <DialogTitle>
                        Create a new <span className={cn("m-1", type === "income" ? "text-green-500" : "text-red-500")}>{type === "income" ? "Income" : "Expense"}</span> transaction
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={''} {...field} placeholder="Enter a description (optional)" />
                                    </FormControl>
                                    {/* <FormDescription>
                                        Transaction description (optional)
                                    </FormDescription> */}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount <span className="text-red-500 font-bold">*</span></FormLabel>
                                    <FormControl>
                                        <Input defaultValue={0} type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                    {/* <FormDescription>
                                        Transaction amount (required)
                                    </FormDescription> */}
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-2 justify-between mt-3">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="whitespace-nowrap">Category <span className="text-red-500 font-bold">*</span></FormLabel>
                                        <FormControl className="flex-1">
                                            <CategoryPicker type={type} onChange={handleCategoryChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="whitespace-nowrap">Transaction Date <span className="text-red-500 font-bold">*</span></FormLabel>
                                        <FormControl className="flex-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("w-[200px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? (format(field.value, "PPP")) : "Select date"}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(value) => {
                                                            if (!value) return;
                                                            console.log(value);
                                                            field.onChange(value);
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"} onClick={() => {
                            form.reset();
                        }}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                        {isPending ? <Loader2 /> : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}