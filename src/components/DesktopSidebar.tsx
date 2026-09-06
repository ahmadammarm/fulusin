"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { LayoutDashboard, ReceiptText, Settings2, LogOut } from "lucide-react";

export default function DesktopSidebar() {

    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    const mutation = useMutation({
        mutationFn: async () => {
            const logout = await signOut({ callbackUrl: "/sign-in", redirect: true });

            return logout;
        },
        onSuccess: () => {
            toast.success("Logged out successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred during logout.");
        }
    });

    const handleLogout = () => {
        mutation.mutate();
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-gray-200 bg-background">
            <SidebarHeader className="p-5">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="px-2 mt-4 gap-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard" className={pathname === "/dashboard" ? "bg-teal-700/20 text-teal-500 font-medium hover:bg-teal-700/30 hover:text-teal-600" : ""}>
                                <Link href="/dashboard">
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/transactions")} tooltip="Transactions" className={pathname.startsWith("/dashboard/transactions") ? "bg-teal-700/20 text-teal-500 font-medium hover:bg-teal-700/30 hover:text-teal-600" : ""}>
                                <Link href="/dashboard/transactions">
                                    <ReceiptText />
                                    <span>Transactions</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/manage")} tooltip="Manage" className={pathname.startsWith("/dashboard/manage") ? "bg-teal-700/20 text-teal-500 font-medium hover:bg-teal-700/30 hover:text-teal-600" : ""}>
                                <Link href="/dashboard/manage">
                                    <Settings2 />
                                    <span>Manage</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-full flex justify-start gap-2 overflow-hidden"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span className="truncate">Logout</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to log out?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout} disabled={mutation.isPending} className="bg-red-500 hover:bg-red-700 text-white transition-colors">
                                {mutation.isPending ? "Logging out..." : "Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarFooter>
        </Sidebar>
    )
}