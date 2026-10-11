"use client"

import { Category } from "../../src/generated/prisma/client"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import CategoryDeleteDialog from "./CategoryDeleteDialog"

interface CategoryCardProps {
    category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const isIncome = category.type === "income"

    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3 sm:p-4 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-md">
            {/* Top Indicator Dot */}
            <div className="flex items-center justify-end w-full mb-1">
                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        isIncome ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                    title={`${category.type} category`}
                />
            </div>

            {/* Icon & Title */}
            <div className="flex flex-col items-center gap-2 my-1">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-muted/60 text-2xl sm:text-3xl shadow-2xs transition-transform duration-200 group-hover:scale-105 border border-border/40">
                    <span role="img" aria-label={category.name}>
                        {category.icon}
                    </span>
                </div>
                <div className="w-full px-1">
                    <p
                        className="truncate text-xs sm:text-sm font-semibold text-foreground tracking-tight"
                        title={category.name}
                    >
                        {category.name}
                    </p>
                </div>
            </div>

            {/* Remove Action */}
            <div className="mt-3 pt-2 border-t border-border/40 w-full">
                <CategoryDeleteDialog
                    trigger={
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg gap-1.5 transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                        </Button>
                    }
                    category={category}
                />
            </div>
        </div>
    )
}
