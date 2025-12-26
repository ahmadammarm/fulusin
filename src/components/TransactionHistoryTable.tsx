/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, useQuery } from "@tanstack/react-query";
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
} from "@tanstack/react-table"
import { GetTransactionHistoryResponse } from "@/app/api/transaction-history/route";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SkeletonWrapper from "./SkeletonWrapper";
import { DataTableColumnHeader } from "./data-table/ColumnHeader";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "./data-table/FacetedFilter";
import { DataTableViewOptions } from "./data-table/ColumnToggle";
import { ChevronLeft, ChevronRight, DownloadIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

import { download, generateCsv, mkConfig } from "export-to-csv";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import TransactionDeleteDialog from "./TransactionDeleteDialog";

type TransactionHistoryRow = GetTransactionHistoryResponse[0];


export const columns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        filterFn: (row, columnId, filterValue) => {
            return filterValue.includes(row.getValue(columnId))
        },
        cell: ({ row }) => (
            <div className="flex gap-2 capitalize">
                {row.original.categoryIcon}
                <div className="capitalize">
                    {row.original.category}
                </div>
            </div>
        )
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.description}
            </div>
        )
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {

            const date = new Date(row.original.date);
            const formattedDate = date.toISOString().slice(0, 10);
            return (<div className="text-muted-foreground">
                {formattedDate}
            </div>)
        }
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        filterFn: (row, columnId, filterValue) => {
            return filterValue.includes(row.getValue(columnId))
        },
        cell: ({ row }) => (
            <div className={cn("capitalize rounded-lg text-center p-2", row.original.type === "income" && "bg-emerald-400/10 text-emerald-500", row.original.type === "expense" && "bg-red-400/10 text-red-500")}>
                {row.original.type}
            </div>
        )
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
                {row.original.formattedAmount}
            </p>
        )
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <RowActions transaction={row.original} />
        )
    }
];

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: "transaction_history.csv"
})

export default function TransactionHistoryTable() {

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const transactionHistory = useQuery<GetTransactionHistoryResponse>({
        queryKey: ["transactionHistory"],
        queryFn: async () => {
            const response = await axios.get(`/api/transaction-history`);
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    const queryClient = new QueryClient();
    queryClient.invalidateQueries({
        queryKey: ["transactionHistory"]
    });

    const handleExportCsv = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    }

    const dataTable = useReactTable({
        data: transactionHistory.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        state: {
            sorting,
            columnFilters
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const categoriesOption = useMemo(() => {
        const categoriesMap = new Map();
        transactionHistory.data?.forEach((transaction) => {
            categoriesMap.set(transaction.category, {
                label: `${transaction.categoryIcon} ${transaction.category}`,
                value: transaction.category
            });
        });
        const uniqueCategories = new Set(categoriesMap.values());
        return Array.from(uniqueCategories);
    }, [transactionHistory.data]);

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-end justify-between gap-2 py-4">
                <div className="flex gap-2">
                    {dataTable.getColumn("category") && (
                        <DataTableFacetedFilter
                            column={dataTable.getColumn("category")}
                            title="Category"
                            options={categoriesOption}
                        />
                    )}
                    {dataTable.getColumn("type") && (
                        <DataTableFacetedFilter
                            column={dataTable.getColumn("type")}
                            title="Type"
                            options={[
                                { label: "Income", value: "income" },
                                { label: "Expense", value: "expense" },
                            ]}
                        />
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant={"outline"} size={"sm"} className="ml-auto h-8 lg:flex" onClick={() => {
                        const data = dataTable.getFilteredRowModel().rows.map(row => ({
                            category: row.original.category,
                            description: row.original.description,
                            type: row.original.type,
                            amount: row.original.amount,
                            formattedAmount: row.original.formattedAmount,
                            date: row.original.date,
                        }));
                        handleExportCsv(data);
                    }}>
                        <DownloadIcon className="mr-2 w-4 h-4" />
                        Export to CSV
                    </Button>
                    <DataTableViewOptions table={dataTable} />
                </div>
            </div>
            <SkeletonWrapper isLoading={transactionHistory.isFetching}>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {dataTable.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {dataTable.getRowModel().rows?.length ? (
                                dataTable.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => dataTable.previousPage()}
                        disabled={!dataTable.getCanPreviousPage()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => dataTable.nextPage()}
                        disabled={!dataTable.getCanNextPage()}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </SkeletonWrapper>
        </div>
    )
}

const RowActions = ({ transaction }: { transaction: TransactionHistoryRow }) => {
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false)

    return (
        <>
            <TransactionDeleteDialog open={isOpenDeleteDialog} setOpen={setIsOpenDeleteDialog} transactionId={transaction.id} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2" onSelect={() => {
                        setIsOpenDeleteDialog((prev) => !prev)
                    }}>
                        <TrashIcon className="w-4 h-4 text-muted-foreground" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )

}