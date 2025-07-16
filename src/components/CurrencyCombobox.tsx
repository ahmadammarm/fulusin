"use client"

import * as React from "react"

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



export function CurrencyCombobox() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedCurrency, setSelectedCurrency] = React.useState<Currency | null>(
        null
    )

    if (isDesktop) {
        return (
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
        )
    }

    return (
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
