import { Target } from "lucide-react";

export default function PlanningHeader() {
    return (
        <div className="border-b bg-card">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <Target className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Financial Planning</h1>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
                    Set monthly budgets, track savings goals, and automate recurring transactions.
                </p>
            </div>
        </div>
    );
}
