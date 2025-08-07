import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SkeletonWrapper from "./SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { GetHistoryPeriodResponseType } from "@/app/api/history-period/route";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { SelectItem } from "@radix-ui/react-select";

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

    const historyPeriods = useQuery<GetHistoryPeriodResponseType>({
        queryKey: ["overview", "history-periods"],
        queryFn: async () => {
            const response = await axios.get("/api/history-period");
            return response.data.data;
        }
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>
            <div className="flex flex-wrap items-center gap-2">
                <SkeletonWrapper isLoading={historyPeriods.isFetching}>
                    <YearSelector period={period} setPeriod={setPeriod} years={historyPeriods.data || []} />
                </SkeletonWrapper>
            </div>
        </div>
    );
}

const YearSelector = ({ period, setPeriod, years }:
    { period: Period; setPeriod: (period: Period) => void; years: GetHistoryPeriodResponseType }
) => {
    return (
        <Select value={period.year.toString()} onValueChange={(value) => setPeriod({ month: period.month, year: parseInt(value) })}>
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}