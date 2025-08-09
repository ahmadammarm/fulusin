import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <Navbar />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}
