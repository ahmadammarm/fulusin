"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
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

export default function DesktopSidebar() {

    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/sign-in");
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
        <div className="w-64 h-full">
            <Sidebar className="border-r border-gray-200 bg-background">
                <SidebarHeader>
                    <Logo />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <nav>
                            <ul className="flex flex-col gap-1 px-2">
                                <li>
                                    <Link
                                        href="/dashboard"
                                        className={`block rounded px-3 py-2 transition-colors ${pathname === "/dashboard"
                                            ? "bg-teal-700 text-white font-medium"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/dashboard/transactions"
                                        className={`block rounded px-3 py-2 transition-colors ${pathname.startsWith("/dashboard/transactions")
                                            ? "bg-teal-700 text-white font-medium"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        Transactions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/dashboard/manage"
                                        className={`block rounded px-3 py-2 transition-colors ${pathname.startsWith("/dashboard/manage")
                                            ? "bg-teal-700 text-white font-medium"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        Manage
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/dashboard/education"
                                        className={`block rounded px-3 py-2 transition-colors ${pathname.startsWith("/dashboard/education")
                                            ? "bg-teal-700 text-white font-medium"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        Education
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold transition-colors"
                            >
                                Logout
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
        </div>
    )
}