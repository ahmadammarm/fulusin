import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import HistorySection from "@/components/HistorySection";
import OverviewSection from "@/components/OverviewSection";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await auth().then((session) => {
        if (!session?.user) {
            redirect("/sign-in");
        }
        return session.user;
    });

    const currencySettings = await prisma.currencySettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!currencySettings) {
        redirect("/wizard");
    }

    return (
        <div className="min-h-full bg-background pb-12">
            {/* Unified Command Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                                Welcome back, {user.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                                Monitor your cash flow velocity, channel allocations, and financial history.
                            </p>
                        </div>

                        {/* Quick action buttons */}
                        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                            <CreateTransactionDialog
                                trigger={
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm whitespace-nowrap justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>New Income</span>
                                    </Button>
                                }
                                type="income"
                                currency={currencySettings.currency}
                            />
                            <CreateTransactionDialog
                                trigger={
                                    <Button
                                        size="sm"
                                        className="w-full sm:w-auto h-9 px-3.5 bg-rose-600 hover:bg-rose-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm whitespace-nowrap justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>New Expense</span>
                                    </Button>
                                }
                                type="expense"
                                currency={currencySettings.currency}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Sections */}
            <div className="space-y-6 sm:space-y-8">
                <OverviewSection currencySettings={currencySettings} />
                <HistorySection currencySettings={currencySettings} />
            </div>
        </div>
    );
}
