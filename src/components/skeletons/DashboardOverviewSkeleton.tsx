import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatisticsCardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl border border-border/70 shadow-2xs overflow-hidden">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-3 w-24 rounded-sm" />
                            <Skeleton className="h-7 w-36 rounded-md" />
                            <Skeleton className="h-2.5 w-20 rounded-xs" />
                        </div>
                        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function CategoriesStatisticsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            {[1, 2].map((cardIdx) => (
                <Card key={cardIdx} className="rounded-2xl border border-border/70 shadow-2xs overflow-hidden">
                    <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-5 w-36 rounded-md" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 space-y-4">
                        {[1, 2, 3, 4].map((itemIdx) => (
                            <div key={itemIdx} className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-5 rounded-md" />
                                        <Skeleton className="h-4 w-28 rounded-sm" />
                                    </div>
                                    <Skeleton className="h-4 w-20 rounded-sm" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function DashboardOverviewSkeleton() {
    return (
        <section className="container mx-auto px-4 sm:px-6 pt-6 animate-in fade-in duration-200">
            {/* Overview Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div className="space-y-1.5">
                    <Skeleton className="h-7 w-48 rounded-md" />
                    <Skeleton className="h-4 w-72 max-w-full rounded-sm" />
                </div>
                <Skeleton className="h-10 w-full sm:w-64 rounded-xl shrink-0" />
            </div>

            {/* Metrics & Categories Skeletons */}
            <div className="flex flex-col w-full gap-6 mt-6">
                <StatisticsCardSkeleton />
                <CategoriesStatisticsSkeleton />
            </div>
        </section>
    );
}
