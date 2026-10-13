import DashboardOverviewSkeleton from "@/components/skeletons/DashboardOverviewSkeleton";
import DashboardHistorySkeleton from "@/components/skeletons/DashboardHistorySkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="min-h-full bg-background pb-12 animate-in fade-in duration-200">
            {/* Unified Command Header Skeleton */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64 rounded-lg" />
                            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                            <Skeleton className="h-9 w-full sm:w-32 rounded-xl" />
                            <Skeleton className="h-9 w-full sm:w-32 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Sections Skeletons */}
            <div className="space-y-6 sm:space-y-8">
                <DashboardOverviewSkeleton />
                <DashboardHistorySkeleton />
            </div>
        </div>
    );
}
