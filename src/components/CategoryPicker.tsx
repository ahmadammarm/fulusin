"use client"

import { TransactionType } from "@/lib/types"
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query"
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import CategoryRow from "./CategoryRow";
import { Command, CommandInput } from "./ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";


interface CategoryPickerProps {
    type: TransactionType
}

export default function CategoryPicker({ type }: CategoryPickerProps) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("")

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

    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} role="combobox" aria-expanded={open} className={cn("w-[200px] justify-between")} >
                {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select a category"}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command onSubmit={(event) => {
                event.preventDefault();
            }}>
                <CommandInput
                    placeholder="Search categories..."
                />
                <CreateCategoryDialog type={type} />
            </Command>
        </PopoverContent>
    </Popover>
}