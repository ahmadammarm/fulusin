import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="min-h-full bg-background pb-12 animate-in fade-in duration-200">
            {/* Header banner skeleton */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64 rounded-lg" />
                            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-9 w-32 rounded-xl" />
                            <Skeleton className="h-9 w-32 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content skeletons */}
            <div className="container mx-auto px-4 sm:px-6 pt-6 space-y-8">
                {/* Overview Toolbar skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                    <div className="space-y-1.5">
                        <Skeleton className="h-6 w-48 rounded-md" />
                        <Skeleton className="h-3.5 w-72 rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-60 rounded-xl" />
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                </div>

                {/* Top Channels Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>

                {/* History Analytics Chart Skeleton */}
                <Skeleton className="h-80 rounded-2xl" />
            </div>
        </div>
    );
}
