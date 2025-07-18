"use client"

import { TransactionType } from "@/lib/types";
import { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import CategoryPicker from "./CategoryPicker";

interface Props {
    trigger: ReactNode;
    type: TransactionType
}

export default function CreateTransactionDialog({ trigger, type }: Props) {

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
        },
    })

    return (
        <Dialog>
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
                                        <Input defaultValue={0} {...field} type="number" />
                                    </FormControl>
                                    {/* <FormDescription>
                                        Transaction amount (required)
                                    </FormDescription> */}
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-2 justify-between">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category <span className="text-red-500 font-bold">*</span></FormLabel>
                                        <FormControl>
                                            <CategoryPicker type={type} />
                                        </FormControl>
                                        {/* <FormDescription>
                                            Select a category for the transaction
                                        </FormDescription> */}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}