"use client"

import { TransactionType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import axios from 'axios'
import SkeletonWrapper from "./SkeletonWrapper"
import { Card, CardContent, CardHeader } from "./ui/card"
import { ArrowDownLeft, ArrowUpRight, FolderPlus, Plus, Search, X } from "lucide-react"
import CreateCategoryDialog from "./CreateCategoryDialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Category } from "../../src/generated/prisma/client"
import CategoryCard from '@/components/CategoryCard'
import { useMemo, useState } from "react"

interface CategoryListProps {
    type: TransactionType
}

export default function CategoryList({ type }: CategoryListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const isIncome = type === "income"

    const fetchCategoriesData = async () => {
        const categoriesResponse = await axios.get(`/api/categories?type=${type}`)
        return categoriesResponse.data as Category[]
    }

    const categoriesData = useQuery({
        queryKey: ["categories", type],
        queryFn: fetchCategoriesData,
    })

    const allCategories = useMemo(() => categoriesData.data || [], [categoriesData.data])
    const totalCount = allCategories.length

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return allCategories
        return allCategories.filter((category) =>
            category.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
    }, [allCategories, searchQuery])

    return (
        <SkeletonWrapper isLoading={categoriesData.isLoading}>
            <Card className="border border-border/70 shadow-xs overflow-hidden">
                <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                    <div className="flex flex-col gap-4">
                        {/* Top row: Title, Type Icon, Count Badge, and Create Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 ${
                                        isIncome
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                    }`}
                                >
                                    {isIncome ? (
                                        <ArrowDownLeft className="h-5 w-5" />
                                    ) : (
                                        <ArrowUpRight className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                                            {isIncome ? "Income" : "Expense"} Categories
                                        </h2>
                                        <Badge
                                            variant="secondary"
                                            className={`text-xs px-2 py-0.5 border ${
                                                isIncome
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                            }`}
                                        >
                                            {totalCount} {totalCount === 1 ? "category" : "categories"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Organize and label your {type} transactions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <CreateCategoryDialog
                                    type={type}
                                    onSuccessCallback={() => {
                                        categoriesData.refetch()
                                    }}
                                    trigger={
                                        <Button
                                            size="sm"
                                            className={`gap-1.5 h-9 text-xs sm:text-sm font-medium ${
                                                isIncome
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                                                    : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                                            }`}
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>New Category</span>
                                        </Button>
                                    }
                                />
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        {totalCount > 0 && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={`Filter ${type} categories...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-background border-input"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>

                                {searchQuery && (
                                    <p className="text-xs text-muted-foreground">
                                        Showing {filteredCategories.length} of {totalCount}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                    {/* Empty State: No categories registered at all */}
                    {totalCount === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border/80 rounded-xl bg-muted/10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                                <FolderPlus className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm sm:text-base font-semibold text-foreground">
                                No {type} categories yet
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                                Create your first {type} category to start tagging your incoming funds and outflows.
                            </p>
                            <CreateCategoryDialog
                                type={type}
                                onSuccessCallback={() => {
                                    categoriesData.refetch()
                                }}
                                trigger={
                                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Create First Category</span>
                                    </Button>
                                }
                            />
                        </div>
                    )}

                    {/* Empty State: Search filter returned no matches */}
                    {totalCount > 0 && filteredCategories.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border/80 rounded-xl bg-muted/10">
                            <p className="text-sm font-medium text-foreground">
                                No categories match &ldquo;{searchQuery}&rdquo;
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 mb-3">
                                Try searching for another name or reset the filter.
                            </p>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSearchQuery("")}
                                className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700"
                            >
                                Clear search filter
                            </Button>
                        </div>
                    )}

                    {/* Category Grid */}
                    {filteredCategories.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                            {filteredCategories.map((category: Category) => (
                                <CategoryCard key={`${category.name}-${category.type}`} category={category} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </SkeletonWrapper>
    )
}
