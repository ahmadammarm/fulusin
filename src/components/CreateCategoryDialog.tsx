"use client"

import { TransactionType } from "@/lib/types";
import { categorySchema } from "@/schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

export default function CreateCategoryDialog({ type }: { type: TransactionType }) {

    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            type
        }
    });




    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} className="flex items-center border-separata justify-start rounded-none border-b px-3 py-3 text-muted-foreground">
                    <PlusSquareIcon className="mr-2 h-4 w-4" />
                    Create new category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create <span className={cn("m-1", type === "income" ? "text-green-500" : "text-red-500")}>{type}</span> category
                    </DialogTitle>
                    <DialogDescription>
                        Categories are used to organize your transactions. You can create a new category here.
                    </DialogDescription>
                    <Form {...form}>
                        <form className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className="text-red-500 font-bold">*</span></FormLabel>
                                        <FormControl>
                                            <Input defaultValue={''} {...field} placeholder="Enter your category name" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}