import { Category } from "@prisma/client";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import CategoryDeleteDialog from "./CategoryDeleteDialog";

export default function CategoryCard({ category }: { category: Category }) {
    return (
        <div className="flex border-separate flex-col justify-between rounded-md border shadow-md">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl" role="img">{category.icon}</span>
                <span className="text-md text-white font-bold">{category.name}</span>
            </div>
            <CategoryDeleteDialog trigger={
                <Button className="flex w-full items-center gap-2 border-separate rounded-t-none text-muted-foreground hover:bg-red-500/20" variant={"secondary"}>
                    <TrashIcon className="w-4 h-4" />
                    Remove
                </Button>
            } category={category} />
        </div>
    )
}