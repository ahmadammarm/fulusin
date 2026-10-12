"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Logo from "./Logo";
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
import { LayoutDashboard, ReceiptText, Settings2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DesktopSidebar() {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();

    const mutation = useMutation({
        mutationFn: async () => {
            return await signOut({ callbackUrl: "/", redirect: true });
        },
        onSuccess: () => {
            toast.success("Logged out successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred during logout.");
        },
    });

    const handleLogout = () => {
        mutation.mutate();
    };

    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const isDashboardActive = pathname === "/dashboard";
    const isTransactionsActive = pathname.startsWith("/dashboard/transactions");
    const isManageActive = pathname.startsWith("/dashboard/manage");

    return (
        <Sidebar collapsible="icon" className="border-r border-border/80 bg-card">
            <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
                <Logo />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="px-2 mt-2 gap-1.5">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isDashboardActive}
                                tooltip="Dashboard"
                                className={cn(
                                    "transition-colors rounded-xl h-9 px-3 text-xs sm:text-sm font-medium",
                                    isDashboardActive
                                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold hover:bg-teal-500/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Link href="/dashboard" onClick={handleLinkClick}>
                                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isTransactionsActive}
                                tooltip="Transactions"
                                className={cn(
                                    "transition-colors rounded-xl h-9 px-3 text-xs sm:text-sm font-medium",
                                    isTransactionsActive
                                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold hover:bg-teal-500/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Link href="/dashboard/transactions" onClick={handleLinkClick}>
                                    <ReceiptText className="h-4 w-4 shrink-0" />
                                    <span>Transactions</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isManageActive}
                                tooltip="Manage"
                                className={cn(
                                    "transition-colors rounded-xl h-9 px-3 text-xs sm:text-sm font-medium",
                                    isManageActive
                                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold hover:bg-teal-500/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Link href="/dashboard/manage" onClick={handleLinkClick}>
                                    <Settings2 className="h-4 w-4 shrink-0" />
                                    <span>Manage</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2 border-t border-border/60">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <SidebarMenuButton
                            tooltip="Logout"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:text-rose-300 transition-colors rounded-xl h-9 px-3 text-xs sm:text-sm cursor-pointer"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span>Logout</span>
                        </SidebarMenuButton>
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
                                disabled={mutation.isPending}
                                className="bg-rose-600 hover:bg-rose-700 text-white"
                            >
                                {mutation.isPending ? "Logging out..." : "Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
