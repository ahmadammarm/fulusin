
"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    PaginationState,
    Table as ReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SkeletonWrapper from "./SkeletonWrapper";
import { useState } from "react";
import { ChevronLeft, ChevronRight, DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { download, generateCsv, mkConfig } from "export-to-csv";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface GlobalDataTableProps<TData> {
    columns: ColumnDef<TData>[];
    apiRoute: string;
    queryKey: string[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchColumn?: string;
    exportable?: boolean;
    exportFilename?: string;
    pageSize?: number;
    additionalFilters?: (table: ReactTable<TData>) => React.ReactNode;
    additionalActions?: (table: ReactTable<TData>) => React.ReactNode;
    onRowClick?: (row: TData) => void;
}

export default function GlobalDataTable<TData extends Record<string, unknown>>({
    columns,
    apiRoute,
    queryKey,
    searchable = true,
    searchPlaceholder = "Search...",
    searchColumn = "",
    exportable = true,
    exportFilename = "export_data",
    pageSize = 10,
    additionalFilters,
    additionalActions,
    onRowClick,
}: GlobalDataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSize,
    });

    // Fetch data from API
    const { data, isFetching, isError } = useQuery<TData[]>({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await axios.get(apiRoute);
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    // CSV Export handler
    const handleExportCsv = (data: TData[]) => {
        const csvConfig = mkConfig({
            fieldSeparator: ",",
            decimalSeparator: ".",
            useKeysAsHeaders: true,
            filename: `${exportFilename}.csv`
        });
        const csv = generateCsv(csvConfig)(data as Record<string, string | number | boolean>[]);
        download(csvConfig)(csv);
    };

    // Initialize table
    const table = useReactTable({
        data: data || [],
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
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            // Search in specific column if provided
            if (searchColumn) {
                const cellValue = String(row.getValue(searchColumn) || "").toLowerCase();
                return cellValue.includes(searchValue);
            }
            // Otherwise search in all columns
            return Object.values(row.original).some((value) =>
                String(value).toLowerCase().includes(searchValue)
            );
        },
    });

    // Generate page numbers for pagination
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    if (isError) {
        return (
            <div className="w-full p-8 text-center text-red-500">
                Failed to load data. Please try again.
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Top Bar: Search, Filters, Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {searchable && (
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="max-w-sm"
                        />
                    )}
                    {additionalFilters?.(table)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {exportable && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const exportData = table.getFilteredRowModel().rows.map(row => row.original);
                                handleExportCsv(exportData);
                            }}
                        >
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    )}
                    {additionalActions?.(table)}
                </div>
            </div>

            {/* Table */}
            <SkeletonWrapper isLoading={isFetching}>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
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
                                        onClick={() => onRowClick?.(row.original)}
                                        className={onRowClick ? "cursor-pointer" : ""}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
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
                                        colSpan={columns.length + 1}
                                        className="h-24 text-center"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            Rows per page
                        </p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage + 1} of {pageCount || 1}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SkeletonWrapper>
        </div>
    );
}