import { Category } from "@prisma/client";

export default function CategoryRow({ category }: { category: Category }) {
    return (
        <div className="flex items-center gap-2">
            <span role="img">
                {category.icon}
            </span>
            <span className="text-sm font-medium">
                {category.name}
            </span>
        </div>
    );
}