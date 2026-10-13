import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CurrencySettingsSkeleton() {
    return (
        <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-36 rounded-md" />
                            <Skeleton className="h-5 w-12 rounded-sm" />
                        </div>
                        <Skeleton className="h-4 w-72 max-w-full rounded-sm" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Currency selector */}
                    <div className="lg:col-span-5 space-y-3">
                        <Skeleton className="h-4 w-28 rounded-sm" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-4 w-64 rounded-sm" />
                    </div>
                    {/* Right: Live Preview Box */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-border/40 pb-3">
                                <Skeleton className="h-4 w-36 rounded-sm" />
                                <Skeleton className="h-4 w-24 rounded-sm" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function CategoryListSkeleton() {
    return (
        <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-40 rounded-md" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-3.5 w-48 rounded-sm" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-32 rounded-lg self-start sm:self-auto shrink-0" />
                    </div>
                    {/* Search bar */}
                    <Skeleton className="h-9 w-full sm:w-72 rounded-lg" />
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                {/* Category Grid matching exact CategoryCard shape */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col justify-between items-center rounded-xl border border-border/70 bg-card p-3 sm:p-4 text-center shadow-xs min-h-[140px]"
                        >
                            <div className="flex justify-end w-full mb-1">
                                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                            </div>
                            <div className="flex flex-col items-center gap-2 my-1 w-full">
                                <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl" />
                                <Skeleton className="h-3.5 w-16 rounded-sm mt-1" />
                            </div>
                            <div className="mt-3 pt-2 border-t border-border/40 w-full flex justify-center">
                                <Skeleton className="h-6 w-16 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function ManagePreferencesSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            {/* Section 1: Currency Settings */}
            <CurrencySettingsSkeleton />

            {/* Section 2: Category Tabs Skeleton */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-44 rounded-md" />
                        <Skeleton className="h-3.5 w-60 rounded-sm" />
                    </div>
                    {/* Tabs Pill triggers */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-full sm:w-[380px] rounded-xl" />
                    </div>
                </div>

                {/* Category List Card */}
                <CategoryListSkeleton />
            </section>
        </div>
    );
}
