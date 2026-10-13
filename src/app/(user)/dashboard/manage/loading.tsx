import ManagePreferencesSkeleton from "@/components/skeletons/ManagePreferencesSkeleton";
import { SlidersHorizontal } from "lucide-react";

export default function ManageLoading() {
    return (
        <div className="min-h-full bg-background pb-12 animate-in fade-in duration-200">
            {/* Header banner */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    Manage Preferences
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
                                Configure your primary currency, financial format rules, and categorized income and expense channels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <ManagePreferencesSkeleton />
            </div>
        </div>
    );
}
