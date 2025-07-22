"use client"

import { TransactionType } from "@/lib/types"
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import CategoryRow from "./CategoryRow";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";


interface CategoryPickerProps {
    type: TransactionType
    onChange: (category: string) => void;
}

export default function CategoryPicker({ type, onChange }: CategoryPickerProps) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (value) {
            onChange(value);
        } else {
            return
        }
    }, [value, onChange])

    const categoriesQuery = useQuery({
        queryKey: ['categories', type],
        queryFn: async () => {
            const response = await fetch(`/api/categories?type=${type}`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            return response.json();
        },
    })

    const selectedCategory = categoriesQuery.data?.find((category: Category) => category.name === value);

    const successCallback = useCallback((category: Category) => {
        setValue(category.name);
        setOpen(false);
    }, [setValue, setOpen]);

    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} role="combobox" aria-expanded={open} className={cn("w-[200px] justify-between")} >
                {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select a category"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command onSubmit={(event) => {
                event.preventDefault();
            }}>
                <CommandInput
                    placeholder="Search categories..."
                />
                <CreateCategoryDialog type={type} onSuccessCallback={successCallback} />
                <CommandEmpty>
                    <p>Category not found</p>
                    <p className="text-xs text-muted-foreground">Try creating a new one.</p>
                </CommandEmpty>
                <CommandGroup>
                    <CommandList>
                        {categoriesQuery.data?.map((category: Category) => (
                            <CommandItem
                                key={category.name}
                                value={category.name}
                                onSelect={() => {
                                    setValue(category.name);
                                    setOpen(false);
                                }}
                            >
                                <CategoryRow category={category} />
                                <Check className={cn("ml-2 w-4 h-4 opacity-0", value === category.name && "opacity-100")} />
                            </CommandItem>
                        ))}
                    </CommandList>
                </CommandGroup>
            </Command>
        </PopoverContent>
    </Popover>
}