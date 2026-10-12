"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, HandCoins, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

export default function DashboardTopbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut({ redirect: true, callbackUrl: "/sign-in" });
            toast.success("Signed out successfully");
        } catch {
            toast.error("Failed to sign out");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
            {/* Left section: Sidebar trigger & breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <SidebarTrigger className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0" />

                <Separator orientation="vertical" className="h-4 hidden sm:block bg-border/80" />

                {/* Desktop breadcrumb */}
                <nav className="hidden sm:flex items-center gap-1.5 text-xs min-w-0">
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
                <div className="flex sm:hidden items-center gap-1.5 min-w-0">
                    <HandCoins className="h-5 w-5 stroke-teal-500 stroke-[1.5] shrink-0" />
                    <span className="font-bold text-sm bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent truncate">
                        Fulusin
                    </span>
                </div>
            </div>

            {/* Right section: user name & quick sign out */}
            <div className="flex items-center gap-3 shrink-0">
                {session?.user?.name && (
                    <span className="hidden md:inline-block text-xs text-muted-foreground">
                        Signed in as{" "}
                        <strong className="text-foreground font-medium">
                            {session.user.name}
                        </strong>
                    </span>
                )}

                {/* Mobile signout button */}
                <div className="sm:hidden">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                                title="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
                                    Are you sure you want to log out of your Fulusin account?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="bg-rose-600 hover:bg-rose-700 text-white"
                                >
                                    {isLoggingOut ? "Logging out..." : "Confirm"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </header>
    );
}
