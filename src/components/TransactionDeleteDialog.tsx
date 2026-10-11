/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TransactionDelete } from "@/actions/transactionDelete";
import { AlertTriangle, Loader2 } from "lucide-react";

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
            setOpen(false);
        },
        onError: (error: any) => {
            toast.error(`Error deleting transaction: ${error.message || "Unknown error"}`, {
                id: transactionId,
            });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-lg font-bold text-foreground">
                                Delete Transaction
                            </AlertDialogTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Permanent action confirmation
                            </p>
                        </div>
                    </div>
                    <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        Are you sure you want to delete this transaction record? This will permanently remove the transaction and update your historical balance aggregations.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleteMutation.isPending}
                        className="bg-destructive hover:bg-destructive/90 text-white gap-2"
                        onClick={(e) => {
                            e.preventDefault();
                            toast.loading("Deleting transaction...", {
                                id: transactionId,
                            });
                            deleteMutation.mutate(transactionId);
                        }}
                    >
                        {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Delete Transaction
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
