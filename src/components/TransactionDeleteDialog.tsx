"use client";

import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TransactionDelete } from "@/actions/transactionDelete";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

interface TransactionDeleteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    transactionId: string;
}

export default function TransactionDeleteDialog({ open, setOpen, transactionId }: TransactionDeleteDialogProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: TransactionDelete,
        onSuccess: async () => {
            toast.success("Transaction deleted", {
                id: transactionId,
            });
            await queryClient.invalidateQueries({
                queryKey: ["transactionHistory"],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ["overview"],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ["budgets"],
            });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Couldn't delete the transaction: ${error.message || "Unknown error"}`, {
                id: transactionId,
            });
        },
    });

    return (
        <ConfirmDeleteDialog
            open={open}
            setOpen={setOpen}
            title="Delete this transaction?"
            description="It will be removed from your history, and your balance and charts will update. This can't be undone."
            isPending={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate(transactionId)}
        />
    );
}
