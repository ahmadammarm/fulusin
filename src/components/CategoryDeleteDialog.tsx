"use client";

import { CategoryDelete } from "@/actions/categories";
import { Category } from "../../src/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import CategoryIcon from "@/components/CategoryIcon";
import { TransactionType } from "@/lib/types";

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
            toast.success(`Category "${category.name}" deleted`, {
                id: categoryIdentifier,
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(`Couldn't delete the category: ${error.message || "Unknown error"}`, {
                id: categoryIdentifier,
            });
        },
    });

    const isIncome = category.type === "income";

    return (
        <ConfirmDeleteDialog
            open={open}
            setOpen={setOpen}
            trigger={trigger}
            title={`Delete "${category.name}"?`}
            description="A category that is still used by transactions, budgets, or recurring schedules can't be deleted. Remove those first."
            isPending={deleteMutation.isPending}
            onConfirm={() =>
                deleteMutation.mutate({
                    name: category.name,
                    type: category.type as TransactionType,
                })
            }
        >
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon icon={category.icon} className="bg-background" />
                    <p className="text-sm font-semibold text-foreground truncate">{category.name}</p>
                </div>
                <Badge
                    variant="outline"
                    className={
                        isIncome
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs capitalize shrink-0"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs capitalize shrink-0"
                    }
                >
                    {category.type}
                </Badge>
            </div>
        </ConfirmDeleteDialog>
    );
}
