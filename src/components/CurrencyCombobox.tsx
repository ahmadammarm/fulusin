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
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Currencies, Currency } from "@/lib/currencies"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import SkeletonWrapper from "./SkeletonWrapper"
import { CurrencySettings } from "../../src/generated/prisma/client"
import { UpdateUserCurrencyAction } from "@/actions/currencySettings"
import { toast } from "sonner"
import { Check, ChevronsUpDown, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface CurrencyComboboxProps {
    className?: string;
    onCurrencyChange?: (currency: Currency) => void;
}

export function CurrencyCombobox({ className, onCurrencyChange }: CurrencyComboboxProps) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
    const queryClient = useQueryClient()

    const currencySettings = useQuery<CurrencySettings>({
        queryKey: ["currencySettings"],
        queryFn: async () => {
            const response = await fetch("/api/currency-setting")
            if (!response.ok) {
                throw new Error("Failed to fetch currency settings")
            }
            const data = await response.json()
            return data as CurrencySettings
        },
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (!currencySettings.data) {
            return
        }
        const userCurrency = Currencies.find(
            (currency) => currency.value === currencySettings.data.currency
        )
        if (userCurrency) {
            setSelectedCurrency(userCurrency)
        } else {
            setSelectedCurrency(null)
        }
    }, [currencySettings.data])

    const mutation = useMutation({
        mutationFn: UpdateUserCurrencyAction,
        onSuccess: async (data: CurrencySettings) => {
            toast.success("Currency updated successfully", {
                id: "update-currency"
            })

            const updatedCurrency = Currencies.find((currency) => currency.value === data.currency) || null
            setSelectedCurrency(updatedCurrency)
            if (updatedCurrency && onCurrencyChange) {
                onCurrencyChange(updatedCurrency)
            }

            await queryClient.invalidateQueries({
                queryKey: ["currencySettings"]
            })
            await queryClient.invalidateQueries({
                queryKey: ["overview"]
            })
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to update currency", {
                id: "update-currency"
            })
        },
    })

    const selectedCurrencyOption = useCallback((currency: Currency | null) => {
        if (!currency) {
            toast.error("Please select a currency")
            return
        }

        toast.loading("Updating currency...", {
            id: "update-currency"
        })

        mutation.mutate(currency.value)
    }, [mutation])

    const triggerButton = (
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-11 px-3.5 bg-background font-normal border-input hover:bg-accent/50", className)}
            disabled={mutation.isPending}
        >
            <div className="flex items-center gap-2.5 truncate">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold text-xs shrink-0">
                    {selectedCurrency?.value ? selectedCurrency.value.slice(0, 2) : <Coins className="w-3.5 h-3.5" />}
                </span>
                <span className="truncate font-medium text-foreground">
                    {selectedCurrency ? selectedCurrency.label : "Select a currency..."}
                </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    )

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={currencySettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {triggerButton}
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                        <CurrencyList
                            selectedCurrency={selectedCurrency}
                            setOpen={setOpen}
                            setSelectedCurrency={selectedCurrencyOption}
                        />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        )
    }

    return (
        <SkeletonWrapper isLoading={currencySettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {triggerButton}
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left px-4 pt-4 pb-2">
                        <DrawerTitle>Select Currency</DrawerTitle>
                        <DrawerDescription>
                            Choose your preferred currency for all financial calculations.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pt-0">
                        <CurrencyList
                            selectedCurrency={selectedCurrency}
                            setOpen={setOpen}
                            setSelectedCurrency={selectedCurrencyOption}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    )
}

function CurrencyList({
    selectedCurrency,
    setOpen,
    setSelectedCurrency,
}: {
    selectedCurrency: Currency | null
    setOpen: (open: boolean) => void
    setSelectedCurrency: (status: Currency | null) => void
}) {
    return (
        <Command className="rounded-lg border-0">
            <CommandInput placeholder="Search currency by name or code..." className="h-10" />
            <CommandList className="max-h-[260px] p-1">
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    No currency found.
                </CommandEmpty>
                <CommandGroup heading="Available Currencies">
                    {Currencies.map((currency: Currency) => {
                        const isSelected = selectedCurrency?.value === currency.value
                        return (
                            <CommandItem
                                key={currency.value}
                                value={`${currency.value} ${currency.label}`}
                                onSelect={() => {
                                    setSelectedCurrency(currency)
                                    setOpen(false)
                                }}
                                className="flex items-center justify-between py-2 px-3 rounded-md cursor-pointer data-[selected=true]:bg-accent"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-6 w-8 items-center justify-center rounded bg-muted text-[11px] font-mono font-medium text-foreground/80">
                                        {currency.value}
                                    </span>
                                    <span className="text-sm font-medium text-foreground">
                                        {currency.label}
                                    </span>
                                </div>
                                {isSelected && (
                                    <Check className="h-4 w-4 text-teal-500 shrink-0" />
                                )}
                            </CommandItem>
                        )
                    })}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
