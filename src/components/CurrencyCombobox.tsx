/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Currencies, Currency } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "./SkeletonWrapper"
import { CurrencySettings } from "../../src/generated/prisma/client"
import { UpdateUserCurrencyAction } from "@/actions/currencySettings"
import { toast } from "sonner"


export function CurrencyCombobox() {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        null
    )

    const currencySettings = useQuery<CurrencySettings>({
        queryKey: ["currencySettings"],
        queryFn: async () => {
            const response = await fetch("/api/currency-setting");
            if (!response.ok) {
                throw new Error("Failed to fetch currency settings");
            }
            const data = await response.json();
            return data as CurrencySettings;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!currencySettings.data) {
            return
        }
        const userCurrency = Currencies.find((currency) => currency.value === currencySettings.data.currency);
        if (userCurrency) {
            setSelectedCurrency(userCurrency);
        } else {
            setSelectedCurrency(null);
        }
    }, [currencySettings.data]);

    const mutation = useMutation({
        mutationFn: UpdateUserCurrencyAction,
        onSuccess: (data: CurrencySettings) => {
            toast.success("Currency updated successfully", {
                id: "update-currency"
            });

            setSelectedCurrency(Currencies.find((currency) => currency.value === data.currency) || null);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update currency", {
                id: "update-currency"
            });
        },
    });

    const selectedCurrencyOption = useCallback((currency: Currency | null) => {
        if (!currency) {
            toast.error("Please select a currency");
            return
        }

        toast.loading("Updating currency...", {
            id: "update-currency"
        });

        mutation.mutate(currency.value)

    }, [mutation]);

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={currencySettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                            {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <CurrencyList setOpen={setOpen} setSelectedCurrency={selectedCurrencyOption} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        )
    }

    return (
        <SkeletonWrapper isLoading={currencySettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                        {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <CurrencyList setOpen={setOpen} setSelectedCurrency={selectedCurrencyOption} />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    )
}

function CurrencyList({
    setOpen,
    setSelectedCurrency,
}: {
    setOpen: (open: boolean) => void
    setSelectedCurrency: (status: Currency | null) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.filter((currency: Currency) =>
                        currency.label.toLowerCase().includes(
                            ((document.querySelector('input[type="search"]') as HTMLInputElement | null)?.value || '').toLowerCase()
                        )
                    ).map((currency: Currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                setSelectedCurrency(
                                    Currencies.find((currency) => currency.value === value) || null
                                )
                                setOpen(false)
                            }}
                            className="w-full"
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
