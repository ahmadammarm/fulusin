// /* eslint-disable @typescript-eslint/no-explicit-any */
import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import HistorySection from "@/components/HistorySection";
import OverviewSection from "@/components/OverviewSection";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    const user = await auth().then(session => {
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
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-3xl font-bold ml-5">
                        Hello, {user.name}!
                    </p>
                    <div className="flex items-center gap-4 md:ml-0 ml-5">
                        <CreateTransactionDialog trigger={
                            <Button className="border-emerald-500 bg-emerald-800 text-white hover:bg-emerald-950 hover:text-white">
                                New Income
                            </Button>
                        } type="income" />
                        <CreateTransactionDialog trigger={
                            <Button className="border-rose-500 bg-rose-800 text-white hover:bg-rose-950 hover:text-white">
                                New Expense
                            </Button>
                        } type="expense" />
                    </div>
                </div>
            </div>
            <OverviewSection currencySettings={currencySettings} />
            <HistorySection currencySettings={currencySettings} />
        </div>
    )
}