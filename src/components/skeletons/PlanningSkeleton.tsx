import { Skeleton } from "@/components/ui/skeleton";

function ProgressCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-28 rounded-sm" />
                    <Skeleton className="h-3 w-20 rounded-sm" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-sm" />
                <Skeleton className="h-3 w-16 rounded-sm" />
            </div>
        </div>
    );
}

export function BudgetListSkeleton() {
    return (
        <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[72px] rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <ProgressCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function RecurringListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-in fade-in duration-200">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-4 w-28 rounded-sm" />
                            <Skeleton className="h-3 w-20 rounded-sm" />
                        </div>
                        <Skeleton className="h-4 w-20 rounded-sm" />
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border/50">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-3 w-28 rounded-sm" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function GoalListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 animate-in fade-in duration-200">
            {[1, 2, 3].map((i) => (
                <ProgressCardSkeleton key={i} />
            ))}
        </div>
    );
}
