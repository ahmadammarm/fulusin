"use client";

import { TransactionType } from "@/lib/types";
import { Category } from "../../src/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import CategoryRow from "./CategoryRow";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";

interface CategoryPickerProps {
    type: TransactionType;
    onChange: (category: string) => void;
    className?: string;
    value?: string;
}

export default function CategoryPicker({ type, onChange, className, value: propValue }: CategoryPickerProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(propValue || "");

    useEffect(() => {
        if (propValue !== undefined) {
            setValue(propValue);
        }
    }, [propValue]);

    useEffect(() => {
        if (value) {
            onChange(value);
        }
    }, [value, onChange]);

    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: async () => {
            const response = await fetch(`/api/categories?type=${type}`);
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            return response.json();
        },
        staleTime: 1000 * 60,
    });

    const selectedCategory = categoriesQuery.data?.find((category: Category) => category.name === value);

    const successCallback = useCallback(
        (category: Category) => {
            setValue(category.name);
            setOpen(false);
        },
        [setValue, setOpen]
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between h-10 px-3 bg-card border-border/80 text-xs sm:text-sm font-normal truncate",
                        !selectedCategory && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select category"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) min-w-[240px] p-0" align="start">
                <Command
                    onSubmit={(event) => {
                        event.preventDefault();
                    }}
                >
                    <CommandInput placeholder="Search categories..." className="h-9 text-xs sm:text-sm" />
                    <div className="p-1 border-b border-border/60">
                        <CreateCategoryDialog type={type} onSuccessCallback={successCallback} />
                    </div>
                    <CommandEmpty>
                        <div className="py-3 text-center">
                            <p className="text-xs font-medium text-foreground">No category found</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Create a new category above.</p>
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList className="max-h-56">
                            {categoriesQuery.data?.map((category: Category) => (
                                <CommandItem
                                    key={category.name}
                                    value={category.name}
                                    onSelect={() => {
                                        setValue(category.name);
                                        setOpen(false);
                                    }}
                                    className="flex items-center justify-between py-2 text-xs sm:text-sm cursor-pointer"
                                >
                                    <CategoryRow category={category} />
                                    <Check
                                        className={cn(
                                            "ml-2 w-4 h-4 text-teal-600 dark:text-teal-400 opacity-0 shrink-0",
                                            value === category.name && "opacity-100"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
