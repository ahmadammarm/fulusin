import { ColumnDef } from "@tanstack/react-table";
import { GetTransactionHistoryResponse } from "@/app/api/transaction-history/route";
import { DataTableColumnHeader } from "./data-table/ColumnHeader";
import { cn } from "@/lib/utils";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import TransactionDeleteDialog from "./TransactionDeleteDialog";
import { useState, useMemo } from "react";
import { DataTableFacetedFilter } from "./data-table/FacetedFilter";
import { DataTableViewOptions } from "./data-table/ColumnToggle";
import GlobalDataTable from "./GlobalDataTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type TransactionHistoryRow = GetTransactionHistoryResponse[0];

// Row Actions Component
const RowActions = ({ transaction }: { transaction: TransactionHistoryRow }) => {
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);

    return (
        <>
            <TransactionDeleteDialog
                open={isOpenDeleteDialog}
                setOpen={setIsOpenDeleteDialog}
                transactionId={transaction.id}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={() => setIsOpenDeleteDialog((prev) => !prev)}
                    >
                        <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

// Column Definitions
export const transactionColumns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        filterFn: (row, columnId, filterValue) => {
            return filterValue.includes(row.getValue(columnId));
        },
        cell: ({ row }) => (
            <div className="flex gap-2 capitalize">
                {row.original.categoryIcon}
                <div className="capitalize">{row.original.category}</div>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.original.description}</div>
        ),
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toISOString().slice(0, 10);
            return <div className="text-muted-foreground">{formattedDate}</div>;
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        filterFn: (row, columnId, filterValue) => {
            return filterValue.includes(row.getValue(columnId));
        },
        cell: ({ row }) => (
            <div
                className={cn(
                    "capitalize rounded-lg text-center p-2",
                    row.original.type === "income" &&
                    "bg-emerald-400/10 text-emerald-500",
                    row.original.type === "expense" && "bg-red-400/10 text-red-500"
                )}
            >
                {row.original.type}
            </div>
        ),
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
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <RowActions transaction={row.original} />,
    },
];

export default function TransactionHistoryTable() {
    const transactionHistory = useQuery<GetTransactionHistoryResponse>({
        queryKey: ["transactionHistory"],
        queryFn: async () => {
            const response = await axios.get(`/api/transaction-history`);
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    const categoriesOption = useMemo(() => {
        const categoriesMap = new Map();
        transactionHistory.data?.forEach((transaction) => {
            categoriesMap.set(transaction.category, {
                label: `${transaction.categoryIcon} ${transaction.category}`,
                value: transaction.category,
            });
        });
        const uniqueCategories = new Set(categoriesMap.values());
        return Array.from(uniqueCategories);
    }, [transactionHistory.data]);

    return (
        <GlobalDataTable
            columns={transactionColumns}
            apiRoute="/api/transaction-history"
            queryKey={["transactionHistory"]}
            searchable={true}
            searchPlaceholder="Search transactions..."
            exportable={true}
            exportFilename="transaction_history"
            pageSize={10}
            additionalFilters={(table) => (
                <>
                    {/* {table.getColumn("category") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("category")}
                            title="Category"
                            options={categoriesOption}
                        />
                    )} */}
                    {table.getColumn("type") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("type")}
                            title="Type"
                            options={[
                                { label: "Income", value: "income" },
                                { label: "Expense", value: "expense" },
                            ]}
                        />
                    )}
                </>
            )}
            additionalActions={(table) => (
                <DataTableViewOptions table={table} />
            )}
        />
    );
}