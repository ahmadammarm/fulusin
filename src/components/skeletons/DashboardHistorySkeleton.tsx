import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardHistorySkeleton() {
    return (
        <section className="container mx-auto px-4 sm:px-6 pt-2 animate-in fade-in duration-200">
            {/* Header Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
                <div className="space-y-1.5">
                    <Skeleton className="h-7 w-52 rounded-md" />
                    <Skeleton className="h-4 w-80 max-w-full rounded-sm" />
                </div>
            </div>

            {/* History Card with Simulated Chart Skeleton */}
            <Card className="rounded-2xl border border-border/80 bg-card shadow-xs mt-6 overflow-hidden">
                <CardHeader className="p-5 pb-4 border-b border-border/60">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-36 rounded-xl" />
                            <Skeleton className="h-9 w-28 rounded-xl" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-20 rounded-md" />
                            <Skeleton className="h-6 w-20 rounded-md" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                    {/* Simulated Recharts Bar Chart Skeleton */}
                    <div className="w-full h-[280px] sm:h-[320px] flex flex-col justify-end gap-3 pt-6">
                        <div className="flex items-end justify-between gap-2 h-full px-2 sm:px-6 border-b border-border/40 pb-2">
                            {[40, 65, 30, 85, 55, 70, 45, 90, 60, 75, 50, 65].map((heightPct, idx) => (
                                <div key={idx} className="flex items-end gap-1 flex-1 justify-center h-full">
                                    <Skeleton
                                        className="w-2.5 sm:w-4 rounded-t-sm"
                                        style={{ height: `${heightPct}%` }}
                                    />
                                    <Skeleton
                                        className="w-2.5 sm:w-4 rounded-t-sm opacity-60"
                                        style={{ height: `${Math.max(20, heightPct - 25)}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* X-Axis labels placeholder */}
                        <div className="flex justify-between px-2 sm:px-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                <Skeleton key={i} className="h-3 w-4 rounded-xs" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
