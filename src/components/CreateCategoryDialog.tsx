"use client";

import { TransactionType } from "@/lib/types";
import { categorySchema, CategorySchemaType } from "@/schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "./ui/button";
import { CircleOff, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryAction } from "@/actions/categories";
import { toast } from "sonner";
import { Category } from "../../src/generated/prisma/client";

interface Props {
    type: TransactionType;
    onSuccessCallback: (category: Category) => void;
    trigger?: React.ReactNode;
}

export default function CreateCategoryDialog({ type, onSuccessCallback, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const isIncome = type === "income";

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            icon: "",
            type,
        },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCategoryAction,
        onSuccess: async (createdData: Category) => {
            form.reset({
                name: "",
                icon: "",
                type,
            });
            toast.success("Category created successfully!", {
                id: "create-category-success",
            });

            onSuccessCallback(createdData);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Failed to create category: ${error.message}`, {
                id: "create-category-error",
            });
        },
    });

    const onSubmit = useCallback(
        (values: CategorySchemaType) => {
            mutate(values);
        },
        [mutate]
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center h-8 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 gap-1.5"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create New Category</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xl">
                <DialogHeader className="space-y-1.5 text-left pr-8">
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        New {isIncome ? "Income" : "Expense"} Category
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                        Assign an emoji icon and a distinct label to organize your ledger channels.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-4 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-foreground">
                                        Category Name <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Freelance, Groceries, Rent"
                                            className="h-10 text-xs sm:text-sm bg-background border-border/80"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-foreground">
                                        Category Icon <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    className="h-20 sm:h-24 w-full flex-col gap-1.5 border-dashed border-border/80 hover:border-teal-500/50 bg-muted/20"
                                                >
                                                    {field.value ? (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-3xl sm:text-4xl" role="img">
                                                                {field.value}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">
                                                                Click to switch icon
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                            <CircleOff className="h-6 w-6 opacity-60" />
                                                            <span className="text-xs font-medium">
                                                                Click to select an emoji
                                                            </span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 border-0" align="center">
                                                <Picker
                                                    data={data}
                                                    theme="auto"
                                                    onEmojiSelect={(emoji: { native: string }) => {
                                                        field.onChange(emoji.native || "");
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
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
                                    "w-full sm:w-auto h-10 text-xs sm:text-sm font-semibold text-white gap-2 shadow-xs",
                                    isIncome
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-rose-600 hover:bg-rose-700"
                                )}
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span>Save Category</span>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
