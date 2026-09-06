import Navbar from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Navbar />
                <div className="flex-1 overflow-y-auto relative">
                    <div className="absolute top-4 left-4 z-50 hidden md:block">
                        <SidebarTrigger />
                    </div>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
