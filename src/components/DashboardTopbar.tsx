"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, HandCoins } from "lucide-react";

export default function DashboardTopbar() {
    const pathname = usePathname();

    // Compute active route breadcrumb label
    const getPageTitle = () => {
        if (pathname.startsWith("/dashboard/transactions")) {
            return "Transactions";
        }
        if (pathname.startsWith("/dashboard/manage")) {
            return "Manage Channels";
        }
        if (pathname.startsWith("/dashboard/planning")) {
            return "Planning & Goals";
        }
        return "Overview";
    };

    const currentTitle = getPageTitle();
    const isRootDashboard = pathname === "/dashboard";

    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
            {/* Left section: Sidebar trigger & breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <SidebarTrigger className="hidden md:flex h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0" />

                <Separator orientation="vertical" className="h-4 hidden md:block bg-border/80" />

                {/* Desktop breadcrumb */}
                <nav className="hidden md:flex items-center gap-1.5 text-xs min-w-0">
                    <Link
                        href="/dashboard"
                        className="font-medium text-muted-foreground hover:text-foreground transition-colors truncate"
                    >
                        Dashboard
                    </Link>
                    {!isRootDashboard && (
                        <>
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="font-semibold text-foreground truncate">
                                {currentTitle}
                            </span>
                        </>
                    )}
                </nav>

                {/* Mobile center brand mark */}
                <div className="flex md:hidden items-center gap-1.5 min-w-0">
                    <HandCoins className="h-5 w-5 stroke-teal-500 stroke-[1.5] shrink-0" />
                    <span className="font-bold text-sm bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent truncate">
                        Fulusin
                    </span>
                </div>
            </div>
        </header>
    );
}
