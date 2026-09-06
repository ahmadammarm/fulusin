/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { CurrencySettings } from "../../src/generated/prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/maxDateRangeConstant";
import { toast } from "sonner";
import StatisticsCard from "./StatisticsCard";
import CategoriesStatistics from "./CategoriesStatistics";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Filter } from "lucide-react";

export default function OverviewSection({ currencySettings }: { currencySettings: CurrencySettings }) {

    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });
    const [selectedIncomeCategory, setSelectedIncomeCategory] = useState<string>("all");
    const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<string>("all");

    const categoriesQuery = useQuery<{ income: { name: string; icon: string; type: string }[], expense: { name: string; icon: string; type: string }[] }>({
        queryKey: ["categories"],
        queryFn: async () => {
            const [incomeRes, expenseRes] = await Promise.all([
                fetch("/api/categories?type=income"),
                fetch("/api/categories?type=expense")
            ]);

            const income = incomeRes.ok ? await incomeRes.json() : [];
            const expense = expenseRes.ok ? await expenseRes.json() : [];

            return { income, expense };
        },
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <div className="container flex flex-wrap items-end justify-between gap-3 py-6 px-5">
                <h2 className="ml-3 text-3xl font-bold">
                    Overview
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-2">
                        <Select value={selectedIncomeCategory} onValueChange={setSelectedIncomeCategory}>
                            <SelectTrigger className="w-[180px] h-9 bg-background">
                                <Filter className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
                                <SelectValue placeholder="Income Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Incomes</SelectItem>
                                {categoriesQuery.data?.income.map((category) => (
                                    <SelectItem key={category.name} value={category.name}>
                                        <span className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span>{category.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedExpenseCategory} onValueChange={setSelectedExpenseCategory}>
                            <SelectTrigger className="w-[180px] h-9 bg-background">
                                <Filter className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
                                <SelectValue placeholder="Expense Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Expenses</SelectItem>
                                {categoriesQuery.data?.expense.map((category) => (
                                    <SelectItem key={category.name} value={category.name}>
                                        <span className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span>{category.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DateRangePicker
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={(values) => {
                            const { from, to } = values.range;
                            if (!from || !to) return;
                            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                                toast.error(`The selected date range is too big. Max allowed is ${MAX_DATE_RANGE_DAYS} days.`,)
                                return;
                            }
                            setDateRange({ from, to });
                        }}
                    />
                </div>
            </div>
            <div className="container flex flex-col w-full gap-2">
                <StatisticsCard currencySettings={currencySettings} from={dateRange.from} to={dateRange.to} />
                <CategoriesStatistics currencySettings={currencySettings} from={dateRange.from} to={dateRange.to} selectedIncomeCategory={selectedIncomeCategory} selectedExpenseCategory={selectedExpenseCategory} />
            </div>
        </>
    )
}