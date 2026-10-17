import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
    icon?: string | null;
    className?: string;
}

/** Shows the user's chosen category icon, or a neutral tag when none was set. */
export default function CategoryIcon({ icon, className }: CategoryIconProps) {
    return (
        <span
            className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 border border-border/50 text-lg shrink-0",
                className
            )}
            aria-hidden="true"
        >
            {icon || <Tag className="h-4 w-4 text-muted-foreground" />}
        </span>
    );
}
