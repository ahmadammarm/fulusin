/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryDelete } from "@/actions/categories";
import { Category } from "../../src/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { TransactionType } from "@/lib/types";

interface CategoryDeleteDialogProps {
    trigger: ReactNode;
    category: Category;
}

export default function CategoryDeleteDialog({ trigger, category }: CategoryDeleteDialogProps) {

    const categoryIdentifier = `${category.name}-${category.type}`;

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: CategoryDelete,
        onSuccess: async () => {
            toast.success("Category deleted successfully", {
                id: categoryIdentifier
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        },
        onError: (error: any) => {
            toast.error(`Error deleting category: ${error.message || "Unknown error"}`, {
                id: categoryIdentifier
            });
        }
    })



    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone, your category will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast.loading("Deleting category...", {
                            id: categoryIdentifier
                        });
                        deleteMutation.mutate({
                            name: category.name,
                            type: category.type as TransactionType
                        });
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}