import PlanningDashboard from "@/components/planning/PlanningDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Planning & Analytics",
    description: "Manage your budgets, goals, and advanced analytics.",
};

export default function PlanningPage() {
    return <PlanningDashboard />;
}
