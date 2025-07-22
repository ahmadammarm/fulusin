"use client"

import { TransactionType } from "@/lib/types";
import { categorySchema } from "@/schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { CircleOff, PlusSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';


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
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon <span className="text-red-500 font-bold">*</span></FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"ghost"} className="h-[100px] w-full">
                                                        {form.watch("icon") ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className="text-5xl" role="img">
                                                                    {field.value}
                                                                </span>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Click to change
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <CircleOff className="h-[48px] w-[48px]" />
                                                                <p className="text-xs text-muted-foreground">
                                                                    Click to select an icon
                                                                </p>
                                                            </div>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full max-h-60">
                                                    <Picker
                                                        data={data}
                                                        onEmojiSelect={(emoji: { native: string }) => {
                                                            field.onChange(emoji?.native || "");
                                                        }}
                                                    />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button type="button" variant={"secondary"} onClick={() => {
                                                                form.reset();
                                                            }}>
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                        <Button>
                                                            Save
                                                        </Button>
                                                    </DialogFooter>
                                                </PopoverContent>
                                            </Popover>
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