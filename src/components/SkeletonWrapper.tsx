import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function SkeletonWrapper({ children, isLoading, fullWidth = true }: { children: React.ReactNode, isLoading: boolean, fullWidth?: boolean }) {

    if (!isLoading) {
        return <>{children}</>;
    }

    return (
        <Skeleton className={cn(fullWidth && "w-full")}>
            <div className="opacity-0">
                {children}
            </div>
        </Skeleton>
    );

}