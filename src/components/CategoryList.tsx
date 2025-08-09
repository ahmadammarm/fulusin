import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import SkeletonWrapper from "./SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import CategoryCard from '@/components/CategoryCard';

interface CategoryListProps {
    type: TransactionType;
}

export default function CategoryList({ type }: CategoryListProps) {

    const fetchCategoriesData = async () => {
        const categoriesResponse = await axios.get(`/api/categories?type=${type}`);
        return categoriesResponse.data;
    }

    const categoriesData = useQuery({
        queryKey: ["categories", type],
        queryFn: fetchCategoriesData
    });

    const availableData = categoriesData.data && categoriesData.data.length > 0;

    return (
        <SkeletonWrapper isLoading={categoriesData.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {type === "income" ? (
                                <TrendingUp className=" w-12 h-12 p-2 items-center rounded-lg bg-emerald-400/10 text-emerald-500" />
                            ) : (
                                <TrendingDown className=" w-12 h-12 p-2 items-center rounded-lg bg-red-400/10 text-red-500" />
                            )}
                            <div className="ml-3">
                                <h1 className="text-xl">
                                    {type === "income" ? "Income" : "Expense"} Categories
                                </h1>
                                <div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Sorted by name
                                    </p>
                                </div>
                            </div>
                        </div>

                        <CreateCategoryDialog type={type} onSuccessCallback={() => {
                            categoriesData.refetch();
                        }} trigger={
                            <Button className="gap-2 text-sm">
                                <PlusSquare className="w-4 h-4" />
                                Create new category
                            </Button>
                        } />
                    </CardTitle>
                </CardHeader>
                <Separator />
                {!availableData && (
                    <div className="flex h-40 w-full flex-col items-center justify-center">
                        <p>
                            No <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-red-500")}>
                                {type}
                            </span>
                            categories yet
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Create a new category to get started make a transaction
                        </p>
                    </div>
                )}
                {availableData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-4">
                        {categoriesData.data.map((category: Category) => (
                            <CategoryCard key={category.name} category={category} />
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper >
    )
}