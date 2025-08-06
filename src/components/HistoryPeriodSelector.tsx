import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HistoryPeriodSelectorProps {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
}

export default function HistoryPeriodSelector({
    timeframe,
    setTimeframe,
    period,
    setPeriod,
}: HistoryPeriodSelectorProps) {

    const historyPeriods = useQuery({
        queryKey: ["overview", "history-periods"],
        queryFn: async () => {
            const response = await axios.get("/api/history-period");
            return response.data.data;
        }
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            
        </div>
    );
}