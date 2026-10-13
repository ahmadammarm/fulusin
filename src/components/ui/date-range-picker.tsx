'use client'

import React, { type FC, useState, useEffect, useRef, JSX } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { Label } from './label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select'
import { Switch } from './switch'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { DateInput } from './date-input'

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
    /** Initial value for start date */
    initialDateFrom?: Date | string
    /** Initial value for end date */
    initialDateTo?: Date | string
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end'
    /** Option for locale */
    locale?: string
    /** Option for showing compare feature */
    showCompare?: boolean
    /** Additional CSS classes for trigger button */
    className?: string
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === 'string') {
        // Split the date string to get year, month, and day parts
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        // Create a new Date object using the local timezone
        // Note: Month is 0-indexed, so subtract 1 from the month part
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        // If dateInput is already a Date object, return it directly
        return dateInput
    }
}

interface DateRange {
    from: Date
    to: Date | undefined
}

interface Preset {
    name: string
    label: string
}

// Define presets
const PRESETS: Preset[] = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 days' },
    { name: 'last14', label: 'Last 14 days' },
    { name: 'last30', label: 'Last 30 days' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'thisMonth', label: 'This Month' },
    { name: 'lastMonth', label: 'Last Month' }
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = 'end',
    locale = 'en-US',
    showCompare = true,
    className
}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false)

        const [range, setRange] = useState<DateRange>({
            from: getDateAdjustedForTimezone(initialDateFrom),
            to: initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom)
        })
        const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
            initialCompareFrom
                ? {
                    from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
                    to: initialCompareTo
                        ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                        : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
                }
                : undefined
        )

        // Refs to store the values of range and rangeCompare when the date picker is opened
        const openedRangeRef = useRef<DateRange | undefined>(undefined)
        const openedRangeCompareRef = useRef<DateRange | undefined>(undefined)

        const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

        useEffect(() => {
            const newFrom = getDateAdjustedForTimezone(initialDateFrom)
            const newTo = initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom)

            setRange((prev) => {
                const prevFrom = prev.from?.getTime()
                const prevTo = (prev.to ?? prev.from)?.getTime()
                if (prevFrom === newFrom.getTime() && prevTo === newTo.getTime()) {
                    return prev
                }
                return { from: newFrom, to: newTo }
            })
        }, [initialDateFrom, initialDateTo])

        const [isSmallScreen, setIsSmallScreen] = useState(
            typeof window !== 'undefined' ? window.innerWidth < 960 : false
        )

        useEffect(() => {
            const handleResize = (): void => {
                setIsSmallScreen(window.innerWidth < 960)
            }

            window.addEventListener('resize', handleResize)

            // Clean up event listener on unmount
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [])

        const getPresetRange = (presetName: string): DateRange => {
            const preset = PRESETS.find(({ name }) => name === presetName)
            if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
            let from = new Date()
            let to = new Date()
            const first = from.getDate() - from.getDay()

            switch (preset.name) {
                case 'today':
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'yesterday':
                    from.setDate(from.getDate() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(to.getDate() - 1)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last7':
                    from.setDate(from.getDate() - 6)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last14':
                    from.setDate(from.getDate() - 13)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last30':
                    from.setDate(from.getDate() - 29)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisWeek':
                    from.setDate(first)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastWeek':
                    from.setDate(from.getDate() - 7 - from.getDay())
                    to.setDate(to.getDate() - to.getDay() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisMonth': {
                    const today = new Date()
                    from = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0)
                    to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
                    break
                }
                case 'lastMonth': {
                    const today = new Date()
                    from = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0)
                    to = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)
                    break
                }
            }

            return { from, to }
        }

        const setPreset = (preset: string): void => {
            const newRange = getPresetRange(preset)
            setRange(newRange)
            setSelectedPreset(preset)
            let newRangeCompare: DateRange | undefined = undefined
            if (rangeCompare) {
                newRangeCompare = {
                    from: new Date(
                        newRange.from.getFullYear() - 1,
                        newRange.from.getMonth(),
                        newRange.from.getDate()
                    ),
                    to: newRange.to
                        ? new Date(
                            newRange.to.getFullYear() - 1,
                            newRange.to.getMonth(),
                            newRange.to.getDate()
                        )
                        : undefined
                }
                setRangeCompare(newRangeCompare)
            }
            openedRangeRef.current = newRange
            openedRangeCompareRef.current = newRangeCompare
            setIsOpen(false)
            onUpdate?.({ range: newRange, rangeCompare: newRangeCompare })
        }

        useEffect(() => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name)

                const normalizedRangeFrom = new Date(range.from);
                normalizedRangeFrom.setHours(0, 0, 0, 0);
                const normalizedPresetFrom = new Date(
                    presetRange.from.setHours(0, 0, 0, 0)
                )

                const normalizedRangeTo = new Date(range.to ?? 0);
                normalizedRangeTo.setHours(0, 0, 0, 0);
                const normalizedPresetTo = new Date(
                    presetRange.to?.setHours(0, 0, 0, 0) ?? 0
                )

                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name)
                    return
                }
            }

            setSelectedPreset(undefined)
        }, [range])

        const resetValues = (): void => {
            if (openedRangeRef.current) {
                setRange(openedRangeRef.current)
            } else {
                setRange({
                    from:
                        typeof initialDateFrom === 'string'
                            ? getDateAdjustedForTimezone(initialDateFrom)
                            : initialDateFrom,
                    to: initialDateTo
                        ? typeof initialDateTo === 'string'
                            ? getDateAdjustedForTimezone(initialDateTo)
                            : initialDateTo
                        : typeof initialDateFrom === 'string'
                            ? getDateAdjustedForTimezone(initialDateFrom)
                            : initialDateFrom
                })
            }
            if (openedRangeCompareRef.current !== undefined) {
                setRangeCompare(openedRangeCompareRef.current)
            }
        }

        const PresetButton = ({
            preset,
            label,
            isSelected
        }: {
            preset: string
            label: string
            isSelected: boolean
        }): JSX.Element => (
            <Button
                className={cn(isSelected && 'pointer-events-none')}
                variant="ghost"
                onClick={() => {
                    setPreset(preset)
                }}
            >
                <>
                    <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
                        <CheckIcon width={18} height={18} />
                    </span>
                    {label}
                </>
            </Button>
        )

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range
                openedRangeCompareRef.current = rangeCompare
            }
        }, [isOpen, range, rangeCompare])

        return (
            <Popover
                modal={false}
                open={isOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        resetValues()
                    } else {
                        openedRangeRef.current = range
                        openedRangeCompareRef.current = rangeCompare
                    }
                    setIsOpen(open)
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        size={'lg'}
                        variant="outline"
                        className={cn(
                            "h-9 px-3 justify-between font-normal bg-card border-border/80 text-xs sm:text-sm",
                            className
                        )}
                    >
                        <div className="text-left sm:text-right">
                            <div className="py-0.5">
                                <div>{`${formatDate(range.from, locale)}${range.to != null ? ' - ' + formatDate(range.to, locale) : ''
                                    }`}</div>
                            </div>
                            {rangeCompare != null && (
                                <div className="opacity-60 text-xs -mt-1">
                                    <>
                                        vs. {formatDate(rangeCompare.from, locale)}
                                        {rangeCompare.to != null
                                            ? ` - ${formatDate(rangeCompare.to, locale)}`
                                            : ''}
                                    </>
                                </div>
                            )}
                        </div>
                        <div className="pl-1 opacity-60 ml-2">
                            {isOpen ? (<ChevronUpIcon width={16} height={16} />) : (<ChevronDownIcon width={16} height={16} />)}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align={align} className="w-auto max-w-[calc(100vw-2rem)] p-0">
                    <div className="flex py-2">
                        <div className="flex">
                            <div className="flex flex-col">
                                <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                    {showCompare && (
                                        <div className="flex items-center space-x-2 pr-4 py-1">
                                            <Switch
                                                defaultChecked={Boolean(rangeCompare)}
                                                onCheckedChange={(checked: boolean) => {
                                                    if (checked) {
                                                        if (!range.to) {
                                                            setRange({
                                                                from: range.from,
                                                                to: range.from
                                                            })
                                                        }
                                                        setRangeCompare({
                                                            from: new Date(
                                                                range.from.getFullYear(),
                                                                range.from.getMonth(),
                                                                range.from.getDate() - 365
                                                            ),
                                                            to: range.to
                                                                ? new Date(
                                                                    range.to.getFullYear() - 1,
                                                                    range.to.getMonth(),
                                                                    range.to.getDate()
                                                                )
                                                                : new Date(
                                                                    range.from.getFullYear() - 1,
                                                                    range.from.getMonth(),
                                                                    range.from.getDate()
                                                                )
                                                        })
                                                    } else {
                                                        setRangeCompare(undefined)
                                                    }
                                                }}
                                                id="compare-mode"
                                            />
                                            <Label htmlFor="compare-mode">Compare</Label>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <DateInput
                                                value={range.from}
                                                onChange={(date: Date) => {
                                                    const toDate =
                                                        range.to == null || date > range.to ? date : range.to
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: date,
                                                        to: toDate
                                                    }))
                                                }}
                                            />
                                            <div className="py-1">-</div>
                                            <DateInput
                                                value={range.to}
                                                onChange={(date) => {
                                                    const fromDate = date < range.from ? date : range.from
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: fromDate,
                                                        to: date
                                                    }))
                                                }}
                                            />
                                        </div>
                                        {rangeCompare != null && (
                                            <div className="flex gap-2">
                                                <DateInput
                                                    value={rangeCompare?.from}
                                                    onChange={(date) => {
                                                        if (rangeCompare) {
                                                            const compareToDate =
                                                                rangeCompare.to == null || date > rangeCompare.to
                                                                    ? date
                                                                    : rangeCompare.to
                                                            setRangeCompare((prevRangeCompare) => ({
                                                                ...prevRangeCompare,
                                                                from: date,
                                                                to: compareToDate
                                                            }))
                                                        } else {
                                                            setRangeCompare({
                                                                from: date,
                                                                to: new Date()
                                                            })
                                                        }
                                                    }}
                                                />
                                                <div className="py-1">-</div>
                                                <DateInput
                                                    value={rangeCompare?.to}
                                                    onChange={(date) => {
                                                        if (rangeCompare && rangeCompare.from) {
                                                            const compareFromDate =
                                                                date < rangeCompare.from
                                                                    ? date
                                                                    : rangeCompare.from
                                                            setRangeCompare({
                                                                ...rangeCompare,
                                                                from: compareFromDate,
                                                                to: date
                                                            })
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isSmallScreen && (
                                    <Select defaultValue={selectedPreset} onValueChange={(value) => { setPreset(value) }}>
                                        <SelectTrigger className="w-[180px] mx-auto mb-2">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRESETS.map((preset) => (
                                                <SelectItem key={preset.name} value={preset.name}>
                                                    {preset.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <div>
                                    <Calendar
                                        mode="range"
                                        onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                            if (value?.from != null) {
                                                setRange({ from: value.from, to: value.to })
                                            }
                                        }}
                                        selected={range}
                                        numberOfMonths={isSmallScreen ? 1 : 2}
                                        defaultMonth={range.from}
                                    />
                                </div>
                            </div>
                        </div>
                        {!isSmallScreen && (
                            <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                    {PRESETS.map((preset) => (
                                        <PresetButton
                                            key={preset.name}
                                            preset={preset.name}
                                            label={preset.label}
                                            isSelected={selectedPreset === preset.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 py-2 pr-4">
                        <Button
                            onClick={() => {
                                resetValues()
                                setIsOpen(false)
                            }}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                const effectiveRange: DateRange = {
                                    from: range.from,
                                    to: range.to ?? range.from,
                                }
                                openedRangeRef.current = effectiveRange
                                openedRangeCompareRef.current = rangeCompare
                                setRange(effectiveRange)
                                setIsOpen(false)
                                onUpdate?.({ range: effectiveRange, rangeCompare })
                            }}
                        >
                            Update
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
    'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'