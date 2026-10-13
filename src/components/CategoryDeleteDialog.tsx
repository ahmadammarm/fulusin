"use client";

import { CategoryDelete } from "@/actions/categories";
import { Category } from "../../src/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TransactionType } from "@/lib/types";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface CategoryDeleteDialogProps {
    trigger: ReactNode;
    category: Category;
}

export default function CategoryDeleteDialog({ trigger, category }: CategoryDeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const categoryIdentifier = `${category.name}-${category.type}`;
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: CategoryDelete,
        onSuccess: async () => {
            toast.success(`Category "${category.name}" deleted successfully.`, {
                id: categoryIdentifier,
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Error deleting category: ${error.message || "Unknown error"}`, {
                id: categoryIdentifier,
            });
        },
    });

    const handleDelete = () => {
        toast.loading("Deleting category...", {
            id: categoryIdentifier,
        });
        deleteMutation.mutate({
            name: category.name,
            type: category.type as TransactionType,
        });
    };

    const isIncome = category.type === "income";

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-lg font-bold text-foreground">
                                Delete Category
                            </AlertDialogTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Please review before confirming deletion.
                            </p>
                        </div>
                    </div>

                    <AlertDialogDescription asChild>
                        <div className="space-y-3 pt-2 text-sm text-foreground/80">
                            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 p-3.5">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-2xl shadow-2xs border border-border/50">
                                        {category.icon}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">
                                            {category.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {category.type} Category
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        isIncome
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs capitalize"
                                            : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs capitalize"
                                    }
                                >
                                    {category.type}
                                </Badge>
                            </div>

                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Categories referenced by transactions, monthly budgets, or recurring rules cannot be deleted. Please delete or reassign related records first.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={deleteMutation.isPending} className="mt-0">
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="gap-2 cursor-pointer"
                    >
                        {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Delete Category
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
