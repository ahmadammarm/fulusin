import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { GetHistoryPeriodResponseType } from "@/app/api/history-period/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
        queryFn: async () => fetch("/api/history-period").then((res) => res.json()),
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
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
                <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                    <YearSelector period={period} setPeriod={setPeriod} years={historyPeriods.data || []} />
                </SkeletonWrapper>
                {timeframe === "month" && (
                    <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                        <MonthSelector period={period} setPeriod={setPeriod} />
                    </SkeletonWrapper>
                )}
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

const MonthSelector = ({
    period,
    setPeriod
}: {
    period: Period;
    setPeriod: (period: Period) => void;
}) => {
    return (
        <Select
            value={period.month.toString()}
            onValueChange={(value) =>
                setPeriod({ year: period.year, month: parseInt(value) })
            }
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                    const monthName = new Date(period.year, month - 1, 1).toLocaleString("default", {
                        month: "long",
                    });
                    return (
                        <SelectItem key={month} value={month.toString()}>
                            {monthName}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};
