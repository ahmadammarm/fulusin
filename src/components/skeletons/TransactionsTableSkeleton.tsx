import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TransactionsTableSkeleton() {
    return (
        <div className="w-full space-y-6 animate-in fade-in duration-200">
            {/* 1. Summary KPI Metrics Banner (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border border-border/70 shadow-2xs overflow-hidden">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3">
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <Skeleton className="h-3 w-20 rounded-xs" />
                                <Skeleton className="h-7 w-28 rounded-md" />
                                <Skeleton className="h-2.5 w-24 rounded-xs" />
                            </div>
                            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 2. Interactive Filter & Export Toolbar */}
            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-3xl">
                        {/* Search input placeholder */}
                        <Skeleton className="h-9 w-full sm:w-72 rounded-lg" />
                        {/* Type filter placeholder */}
                        <Skeleton className="h-9 w-full sm:w-36 rounded-lg" />
                        {/* Category filter placeholder */}
                        <Skeleton className="h-9 w-full sm:w-44 rounded-lg" />
                    </div>
                    {/* Export button placeholder */}
                    <Skeleton className="h-9 w-32 rounded-lg shrink-0 self-start sm:self-auto" />
                </div>
            </div>

            {/* 3. Modern Financial Ledger Table */}
            <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <Table className="min-w-[720px] lg:min-w-full">
                        <TableHeader className="bg-muted/30 border-b border-border/60">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-3 px-4 w-[130px]">
                                    <Skeleton className="h-3.5 w-16" />
                                </TableHead>
                                <TableHead className="py-3 px-4 w-[180px]">
                                    <Skeleton className="h-3.5 w-20" />
                                </TableHead>
                                <TableHead className="py-3 px-4">
                                    <Skeleton className="h-3.5 w-28" />
                                </TableHead>
                                <TableHead className="py-3 px-4 w-[120px]">
                                    <Skeleton className="h-3.5 w-14" />
                                </TableHead>
                                <TableHead className="py-3 px-4 w-[160px] text-right">
                                    <Skeleton className="h-3.5 w-16 ml-auto" />
                                </TableHead>
                                <TableHead className="py-3 px-4 w-[60px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((rowIdx) => (
                                <TableRow key={rowIdx} className="border-b border-border/40">
                                    {/* Date */}
                                    <TableCell className="py-3 px-4">
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    {/* Category with icon */}
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </TableCell>
                                    {/* Description */}
                                    <TableCell className="py-3 px-4">
                                        <Skeleton className="h-4 w-48 max-w-full" />
                                    </TableCell>
                                    {/* Type badge */}
                                    <TableCell className="py-3 px-4">
                                        <Skeleton className="h-5 w-16 rounded-md" />
                                    </TableCell>
                                    {/* Amount */}
                                    <TableCell className="py-3 px-4 text-right">
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                    </TableCell>
                                    {/* Action button */}
                                    <TableCell className="py-3 px-4 text-center">
                                        <Skeleton className="h-7 w-7 rounded-md ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* 4. Table Pagination Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-border/60 bg-muted/20">
                    <Skeleton className="h-4 w-36" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
