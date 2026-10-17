import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Currencies } from "@/lib/currencies";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";

const DEFAULT_CURRENCY = "USD";

export function useCurrencyFormatter() {
    const { data } = useQuery<{ currency: string }>({
        queryKey: ["currencySettings"],
        queryFn: async () => {
            const response = await fetch("/api/currency-setting");
            if (!response.ok) {
                throw new Error("Failed to fetch currency settings");
            }
            return response.json();
        },
    });

    const currency = data?.currency ?? DEFAULT_CURRENCY;

    return useMemo(() => {
        const match = Currencies.find((c) => c.value === currency);
        return {
            currency,
            symbol: match?.label.split(" ")[0] || currency,
            formatter: GetFormatterForCurrency(match ? currency : DEFAULT_CURRENCY),
        };
    }, [currency]);
}
