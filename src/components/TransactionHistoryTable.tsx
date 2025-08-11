import { DatetoUTCDate } from "@/lib/dateHelper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { GetTransactionHistoryResponse } from "@/app/api/transaction-history/route";

interface TransactionHistoryTableProps {
    from: Date;
    to: Date;
}

type TransactionHistoryRow = GetTransactionHistoryResponse[0];



export const columns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        cell: ({ row }) => (
            <div className="flex gap-2 capitalize">
                {row.original.categoryIcon}
                <div className="capitalize">
                    {row.original.category}
                </div>
            </div>
        )
    }
];

export default function TransactionHistoryTable({ from, to }: TransactionHistoryTableProps) {

    const transactionHistory = useQuery<GetTransactionHistoryResponse>({
        queryKey: ["transactionHistory", "history", from, to],
        queryFn: async () => {
            const response = await axios.get(`/api/transaction-history?from=${DatetoUTCDate(from)}&to=${DatetoUTCDate(to)}`);
            return response.data;
        }
    })

    return (
        <div>

        </div>
    )
}