"use client"

import { useMemo, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import axios from "axios"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { GetTransactionHistoryResponse } from "@/app/api/transaction-history/route"
import { CurrencySettings } from "../../src/generated/prisma/client"
import { GetFormatterForCurrency } from "@/lib/currencyFormatter"
import { format } from "date-fns"
import { formatWibDate } from "@/lib/dateHelper"
import {
    ArrowDownLeft,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Filter,
    FolderPlus,
    MoreHorizontal,
    ReceiptText,
    Search,
    Trash2,
    Wallet,
    X,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DataTableColumnHeader } from "./data-table/ColumnHeader"
import { DataTableFacetedFilter } from "./data-table/FacetedFilter"
import { DataTableViewOptions } from "./data-table/ColumnToggle"
import TransactionDeleteDialog from "./TransactionDeleteDialog"
import ImportCsvModal from "./ImportCsvModal"
import { Card, CardContent } from "./ui/card"
import { download, generateCsv, mkConfig } from "export-to-csv"
import { cn } from "@/lib/utils"

type TransactionHistoryRow = GetTransactionHistoryResponse[0]

// Row Actions Menu
const RowActions = ({ transaction }: { transaction: TransactionHistoryRow }) => {
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false)

    return (
        <>
            <TransactionDeleteDialog
                open={isOpenDeleteDialog}
                setOpen={setIsOpenDeleteDialog}
                transactionId={transaction.id}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer text-xs"
                        onSelect={() => setIsOpenDeleteDialog(true)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default function TransactionHistoryTable() {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "date", desc: true },
    ])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    // Fetch transaction history with Suspense
    const { data: transactionsData } = useSuspenseQuery<GetTransactionHistoryResponse>({
        queryKey: ["transactionHistory"],
        queryFn: async () => {
            const response = await axios.get("/api/transaction-history")
            return response.data
        },
    })

    // Fetch currency settings to format summary KPI cards
    const { data: currencyData } = useSuspenseQuery<CurrencySettings>({
        queryKey: ["currencySettings"],
        queryFn: async () => {
            const res = await fetch("/api/currency-setting")
            if (!res.ok) throw new Error("Failed to fetch currency")
            return res.json()
        },
    })

    const currencyCode = currencyData?.currency || "USD"

    const formatter = useMemo(() => {
        try {
            return GetFormatterForCurrency(currencyCode)
        } catch {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currencyCode,
            })
        }
    }, [currencyCode])

    const transactions = useMemo(() => transactionsData || [], [transactionsData])

    // Calculate Summary KPIs
    const kpiMetrics = useMemo(() => {
        let totalInflow = 0
        let totalOutflow = 0
        let incomeCount = 0
        let expenseCount = 0

        transactions.forEach((t) => {
            if (t.type === "income") {
                totalInflow += t.amount
                incomeCount += 1
            } else {
                totalOutflow += t.amount
                expenseCount += 1
            }
        })

        const netCashFlow = totalInflow - totalOutflow

        return {
            totalCount: transactions.length,
            incomeCount,
            expenseCount,
            totalInflow,
            totalOutflow,
            netCashFlow,
        }
    }, [transactions])

    // Generate unique category filter options with emoji icons
    const categoriesOption = useMemo(() => {
        const categoriesMap = new Map<string, { label: string; value: string }>()
        transactions.forEach((tx) => {
            if (!categoriesMap.has(tx.category)) {
                categoriesMap.set(tx.category, {
                    label: `${tx.categoryIcon} ${tx.category}`,
                    value: tx.category,
                })
            }
        })
        return Array.from(categoriesMap.values()).sort((a, b) => a.value.localeCompare(b.value))
    }, [transactions])

    // Column Definitions for Modern Financial Ledger
    const columns: ColumnDef<TransactionHistoryRow>[] = useMemo(
        () => [
            {
                accessorKey: "category",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Category" />
                ),
                filterFn: (row, columnId, filterValue) => {
                    return filterValue.includes(row.getValue(columnId))
                },
                cell: ({ row }) => {
                    const isIncome = row.original.type === "income"
                    return (
                        <div className="flex items-center gap-3">
                            <span
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-lg border border-border/50 shrink-0 shadow-2xs"
                                role="img"
                                aria-label={row.original.category}
                            >
                                {row.original.categoryIcon}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm text-foreground tracking-tight">
                                    {row.original.category}
                                </span>
                                <span className="text-[11px] text-muted-foreground capitalize flex items-center gap-1 sm:hidden">
                                    <span
                                        className={cn(
                                            "inline-block h-1.5 w-1.5 rounded-full",
                                            isIncome ? "bg-emerald-500" : "bg-rose-500"
                                        )}
                                    />
                                    {row.original.type}
                                </span>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: "description",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Description" />
                ),
                cell: ({ row }) => {
                    const desc = row.original.description?.trim()
                    return desc ? (
                        <span className="text-sm text-foreground/90 max-w-[220px] lg:max-w-[340px] truncate block font-normal" title={desc}>
                            {desc}
                        </span>
                    ) : (
                        <span className="text-xs text-muted-foreground/60 italic">
                            No description
                        </span>
                    )
                },
            },
            {
                accessorKey: "date",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Date" />
                ),
                cell: ({ row }) => {
                    const formattedDisplayDate = formatWibDate(row.original.date, "yyyy-MM-dd")
                    return (
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                            {formattedDisplayDate}
                        </span>
                    )
                },
            },
            {
                accessorKey: "type",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Type" />
                ),
                filterFn: (row, columnId, filterValue) => {
                    return filterValue.includes(row.getValue(columnId))
                },
                cell: ({ row }) => {
                    const isIncome = row.original.type === "income"
                    return (
                        <Badge
                            variant="secondary"
                            className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-md gap-1.5 border capitalize",
                                isIncome
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            )}
                        >
                            {isIncome ? (
                                <ArrowDownLeft className="h-3 w-3" />
                            ) : (
                                <ArrowUpRight className="h-3 w-3" />
                            )}
                            <span>{row.original.type}</span>
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "amount",
                header: ({ column }) => (
                    <div className="text-right">
                        <DataTableColumnHeader column={column} title="Amount" className="justify-end" />
                    </div>
                ),
                cell: ({ row }) => {
                    const isIncome = row.original.type === "income"
                    return (
                        <div className="text-right font-mono font-semibold text-sm">
                            <span
                                className={cn(
                                    "tracking-tight",
                                    isIncome
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-600 dark:text-rose-400"
                                )}
                            >
                                {isIncome ? "+" : "-"}{row.original.formattedAmount}
                            </span>
                        </div>
                    )
                },
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <RowActions transaction={row.original} />
                    </div>
                ),
            },
        ],
        []
    )

    // Filter transactions by active type tab
    const filteredByTabTransactions = useMemo(() => {
        if (typeFilter === "all") return transactions
        return transactions.filter((t) => t.type === typeFilter)
    }, [transactions, typeFilter])

    const table = useReactTable({
        data: filteredByTabTransactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = String(filterValue).toLowerCase().trim()
            if (!search) return true

            const category = String(row.original.category || "").toLowerCase()
            const description = String(row.original.description || "").toLowerCase()
            const formattedAmount = String(row.original.formattedAmount || "").toLowerCase()
            const type = String(row.original.type || "").toLowerCase()
            const date = String(format(new Date(row.original.date), "yyyy-MM-dd")).toLowerCase()

            return (
                category.includes(search) ||
                description.includes(search) ||
                formattedAmount.includes(search) ||
                type.includes(search) ||
                date.includes(search)
            )
        },
    })

    // CSV Export Handler
    const handleExportCsv = () => {
        const rowsToExport = table.getFilteredRowModel().rows.map((row) => ({
            Date: formatWibDate(row.original.date, "yyyy-MM-dd"),
            Category: row.original.category,
            Type: row.original.type,
            Amount: row.original.amount,
            FormattedAmount: row.original.formattedAmount,
            Description: row.original.description || "",
        }))

        if (rowsToExport.length === 0) return

        const csvConfig = mkConfig({
            fieldSeparator: ",",
            decimalSeparator: ".",
            useKeysAsHeaders: true,
            filename: `fulusin_transactions_${format(new Date(), "yyyyMMdd_HHmmss")}`,
        })
        const csv = generateCsv(csvConfig)(rowsToExport)
        download(csvConfig)(csv)
    }

    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex
    const filteredRowsCount = table.getFilteredRowModel().rows.length

    return (
        <div className="w-full space-y-6">
            {/* 1. Summary KPI Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4">
                    {/* Card 1: Total Records */}
                    <Card className="border border-border/70 shadow-2xs overflow-hidden">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                                    Total Records
                                </p>
                                <p
                                    className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1 truncate"
                                    title={String(kpiMetrics.totalCount)}
                                >
                                    {kpiMetrics.totalCount}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                    Recorded entries
                                </p>
                            </div>
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                                <ReceiptText className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Total Inflow */}
                    <Card className="border border-border/70 shadow-2xs overflow-hidden">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider truncate">
                                    Total Inflow
                                </p>
                                <p
                                    className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate"
                                    title={`+${formatter.format(kpiMetrics.totalInflow)}`}
                                >
                                    +{formatter.format(kpiMetrics.totalInflow)}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                    {kpiMetrics.incomeCount} income transactions
                                </p>
                            </div>
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                <ArrowDownLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Total Outflow */}
                    <Card className="border border-border/70 shadow-2xs overflow-hidden">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider truncate">
                                    Total Outflow
                                </p>
                                <p
                                    className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 truncate"
                                    title={`-${formatter.format(kpiMetrics.totalOutflow)}`}
                                >
                                    -{formatter.format(kpiMetrics.totalOutflow)}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                    {kpiMetrics.expenseCount} expense transactions
                                </p>
                            </div>
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                                <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 4: Net Balance */}
                    <Card className="border border-border/70 shadow-2xs overflow-hidden">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                                    Net Cash Flow
                                </p>
                                <p
                                    className={cn(
                                        "text-xl sm:text-2xl font-bold font-mono mt-1 truncate",
                                        kpiMetrics.netCashFlow >= 0
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-rose-600 dark:text-rose-400"
                                    )}
                                    title={`${kpiMetrics.netCashFlow >= 0 ? "+" : ""}${formatter.format(kpiMetrics.netCashFlow)}`}
                                >
                                    {kpiMetrics.netCashFlow >= 0 ? "+" : ""}{formatter.format(kpiMetrics.netCashFlow)}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                                    Current net position
                                </p>
                            </div>
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
                                <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

            {/* 2. Unified Command Toolbar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 sm:p-4 shadow-2xs">
                <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-3 sm:gap-4">
                    {/* Left side: Search input & Type Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0 w-full 2xl:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by category, note, date..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-background border-input"
                            />
                            {globalFilter && (
                                <button
                                    type="button"
                                    onClick={() => setGlobalFilter("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Segmented Type Tabs */}
                        <div className="inline-flex h-9 items-center rounded-lg bg-muted/60 p-1 text-muted-foreground self-start sm:self-auto shrink-0 overflow-x-auto max-w-full">
                            <button
                                type="button"
                                onClick={() => setTypeFilter("all")}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
                                    typeFilter === "all"
                                        ? "bg-background text-foreground shadow-2xs"
                                        : "hover:text-foreground"
                                )}
                            >
                                <span>All</span>
                                <span className="text-[10px] font-mono opacity-70">
                                    ({kpiMetrics.totalCount})
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTypeFilter("income")}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
                                    typeFilter === "income"
                                        ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-2xs"
                                        : "hover:text-foreground"
                                )}
                            >
                                <span>Income</span>
                                <span className="text-[10px] font-mono opacity-70">
                                    ({kpiMetrics.incomeCount})
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTypeFilter("expense")}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
                                    typeFilter === "expense"
                                        ? "bg-background text-rose-600 dark:text-rose-400 shadow-2xs"
                                        : "hover:text-foreground"
                                )}
                            >
                                <span>Expense</span>
                                <span className="text-[10px] font-mono opacity-70">
                                    ({kpiMetrics.expenseCount})
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right side: Filters, Import, Export & Column Visibility */}
                    <div className="flex flex-wrap items-center gap-2 w-full 2xl:w-auto justify-start 2xl:justify-end">
                        {table.getColumn("category") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("category")}
                                title="Category"
                                options={categoriesOption}
                            />
                        )}

                        <ImportCsvModal />

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportCsv}
                            disabled={filteredRowsCount === 0}
                            className="h-8 gap-1.5 text-xs shrink-0"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Export CSV</span>
                        </Button>

                        <DataTableViewOptions table={table} />
                    </div>
                </div>

                {/* Filter info indicator if filters are active */}
                {(globalFilter || typeFilter !== "all" || (table.getState().columnFilters.length > 0)) && (
                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5 text-teal-500" />
                            <span>
                                Showing <strong className="text-foreground">{filteredRowsCount}</strong> of {transactions.length} transactions
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setGlobalFilter("")
                                setTypeFilter("all")
                                table.resetColumnFilters()
                            }}
                        >
                            Reset filters
                        </Button>
                    </div>
                )}
            </div>

            {/* 3. Modern Financial Ledger Table */}
            <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[720px] lg:min-w-full">
                            <TableHeader className="bg-muted/30 border-b border-border/60">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="hover:bg-muted/30 transition-colors border-b border-border/40"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-3 px-4">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-64 text-center p-8"
                                        >
                                            {transactions.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center text-center space-y-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                                        <FolderPlus className="h-6 w-6" />
                                                    </div>
                                                    <p className="text-base font-semibold text-foreground">
                                                        No transactions recorded yet
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                                                        Create your first transaction using the buttons above or import transactions from a CSV file.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center space-y-2">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        No transactions match your current filters
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Try adjusting your search keyword, category, or type filter.
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 mt-2"
                                                        onClick={() => {
                                                            setGlobalFilter("")
                                                            setTypeFilter("all")
                                                            table.resetColumnFilters()
                                                        }}
                                                    >
                                                        Clear all filters
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* 4. Table Pagination Footer */}
                    {filteredRowsCount > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/50 bg-muted/10">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Rows per page</span>
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => table.setPageSize(Number(value))}
                                >
                                    <SelectTrigger className="h-8 w-[70px] text-xs bg-background">
                                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[10, 20, 30, 50, 100].map((size) => (
                                            <SelectItem key={size} value={`${size}`} className="text-xs">
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="ml-2 hidden sm:inline">
                                    Showing {currentPage * table.getState().pagination.pageSize + 1}-
                                    {Math.min(
                                        (currentPage + 1) * table.getState().pagination.pageSize,
                                        filteredRowsCount
                                    )}{" "}
                                    of {filteredRowsCount} records
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    Page {currentPage + 1} of {pageCount || 1}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                        title="First page"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        title="Previous page"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        title="Next page"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => table.setPageIndex(pageCount - 1)}
                                        disabled={!table.getCanNextPage()}
                                        title="Last page"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
