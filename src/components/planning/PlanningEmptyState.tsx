import { LucideIcon } from "lucide-react";

interface PlanningEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export default function PlanningEmptyState({ icon: Icon, title, description, action }: PlanningEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 border-2 border-dashed border-border/70 rounded-xl bg-muted/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-3">
                <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
