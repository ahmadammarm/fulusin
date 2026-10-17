"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNextPeriod, getPreviousPeriod } from "@/lib/dateHelper";
import { Period } from "@/lib/types";

interface MonthNavigatorProps {
    period: Period;
    onChange: (period: Period) => void;
}

export default function MonthNavigator({ period, onChange }: MonthNavigatorProps) {
    const label = format(new Date(period.year, period.month - 1, 1), "MMMM yyyy");

    return (
        <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 h-10">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                aria-label="Previous month"
                onClick={() => onChange(getPreviousPeriod(period))}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[120px] text-center text-xs sm:text-sm font-semibold text-foreground tabular-nums">
                {label}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                aria-label="Next month"
                onClick={() => onChange(getNextPeriod(period))}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
