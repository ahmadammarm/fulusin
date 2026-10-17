"use client";

import { Suspense, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RecurringFormDialog from "@/components/planning/recurring/RecurringFormDialog";
import RecurringList from "@/components/planning/recurring/RecurringList";
import { describeRecordedCount, invalidateLedgerQueries } from "@/components/planning/recurring/invalidateLedgerQueries";
import { RecurringListSkeleton } from "@/components/skeletons/PlanningSkeleton";
import { ProcessDueRecurringTransactionsAction } from "@/actions/recurringExecution";

export default function RecurringSection() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const queryClient = useQueryClient();

    // Records anything that fell due since the last visit; the cron route covers users who don't visit.
    const { mutate: processDue } = useMutation({
        mutationFn: ProcessDueRecurringTransactionsAction,
        onSuccess: async ({ processedCount }) => {
            if (processedCount === 0) return;
            toast.info(describeRecordedCount(processedCount), { id: "process-recurring" });
            await invalidateLedgerQueries(queryClient);
        },
        onError: (error: Error) => {
            toast.error(`Failed to process recurring transactions: ${error.message}`, { id: "process-recurring" });
        },
    });

    useEffect(() => {
        processDue();
    }, [processDue]);

    return (
        <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                            <Repeat className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                                Recurring Transactions
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Income and expenses recorded automatically on a schedule.
                            </p>
                        </div>
                    </div>

                    <RecurringFormDialog
                        open={isCreateOpen}
                        setOpen={setIsCreateOpen}
                        trigger={
                            <Button className="h-10 gap-2 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs self-start sm:self-auto">
                                <Plus className="h-4 w-4" />
                                <span>New Recurring</span>
                            </Button>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <Suspense fallback={<RecurringListSkeleton />}>
                    <RecurringList />
                </Suspense>
            </CardContent>
        </Card>
    );
}
