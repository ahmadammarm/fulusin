"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, ReceiptText, Settings2, LogOut, Target } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

export default function MobileBottomNav() {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut({ callbackUrl: "/", redirect: true });
            toast.success("Logged out successfully!");
        } catch {
            toast.error("An error occurred during logout.");
        } finally {
            setIsLoggingOut(false);
            setIsLogoutOpen(false);
        }
    };

    const navItems = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: pathname === "/dashboard",
        },
        {
            label: "Transactions",
            href: "/dashboard/transactions",
            icon: ReceiptText,
            isActive: pathname.startsWith("/dashboard/transactions"),
        },
        {
            label: "Planning",
            href: "/dashboard/planning",
            icon: Target,
            isActive: pathname.startsWith("/dashboard/planning"),
        },
        {
            label: "Education",
            href: "/dashboard/education",
            icon: GraduationCap,
            isActive: pathname.startsWith("/dashboard/education"),
        },
        {
            label: "Manage",
            href: "/dashboard/manage",
            icon: Settings2,
            isActive: pathname.startsWith("/dashboard/manage"),
        },
    ];

    return (
        <nav
            aria-label="Mobile Navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 dark:bg-card/95 backdrop-blur-lg border-t border-border/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom,0px)]"
        >
            <div className="grid grid-cols-6 h-16 max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-200 select-none",
                                item.isActive
                                    ? "text-teal-600 dark:text-teal-400 font-semibold"
                                    : "text-muted-foreground hover:text-foreground font-medium"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200",
                                    item.isActive
                                        ? "bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 scale-105"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* Logout Action */}
                <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                    <AlertDialogTrigger asChild>
                        <button
                            type="button"
                            className="relative flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-200 select-none text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer font-medium"
                        >
                            <div className="flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600">
                                <LogOut className="h-4 w-4 shrink-0" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight">
                                Logout
                            </span>
                        </button>
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
                                className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
                            >
                                {isLoggingOut ? "Logging out..." : "Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </nav>
    );
}
