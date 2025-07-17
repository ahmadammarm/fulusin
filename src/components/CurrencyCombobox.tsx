/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
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
import { useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "./SkeletonWrapper"
import { CurrencySettings } from "@/generated/prisma"



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
            return response.json();
        }
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

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={currencySettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <CurrencyList setOpen={setOpen} setSelectedCurrency={setSelectedCurrency} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        )
    }

    return (
        <SkeletonWrapper isLoading={currencySettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <CurrencyList setOpen={setOpen} setSelectedCurrency={setSelectedCurrency} />
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
                            {currency.value} - {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
