/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TransactionDelete } from "@/actions/transactionDelete";

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
            toast.success("Transaction deleted successfully", {
                id: transactionId
            });
            queryClient.invalidateQueries({
                queryKey: ["transactionHistory"],
                exact: false
            });
        },
        onError: (error: any) => {
            toast.error(`Error deleting transaction: ${error.message || "Unknown error"}`, {
                id: transactionId
            });
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone, your transaction will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast.loading("Deleting transaction...", {
                            id: transactionId
                        });
                        deleteMutation.mutate(transactionId);
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}