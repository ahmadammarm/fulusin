import DesktopSidebar from "@/components/DesktopSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <DesktopSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <DashboardTopbar />
                <div className="flex-1 overflow-y-auto min-w-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
