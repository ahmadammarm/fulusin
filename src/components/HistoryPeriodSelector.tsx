import { Timeframe } from "@/lib/types";

export default function HistoryPeriodSelector({
    timeframe,
    setTimeframe,
    period,
    setPeriod,
}: {
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
    period: { month: number; year: number };
    setPeriod: (period: { month: number; year: number }) => void;
}) {
    return (
        <div className="flex items-center gap-4">
        
        </div>
    );
}