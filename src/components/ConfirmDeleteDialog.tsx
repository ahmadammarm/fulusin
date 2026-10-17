"use client";

import { Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    isPending: boolean;
    onConfirm: () => void;
    confirmLabel?: string;
    /** Optional preview of the item being deleted, shown between the text and the buttons. */
    children?: React.ReactNode;
    trigger?: React.ReactNode;
}

export default function ConfirmDeleteDialog({
    open,
    setOpen,
    title,
    description,
    isPending,
    onConfirm,
    confirmLabel = "Delete",
    children,
    trigger,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl border-border/80 p-5 sm:p-6 gap-0">
                <AlertDialogHeader className="flex-row items-start gap-4 text-left">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0"
                        aria-hidden="true"
                    >
                        <Trash2 className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0 space-y-1.5 pt-1">
                        <AlertDialogTitle className="text-base sm:text-lg font-semibold leading-tight text-foreground">
                            {title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>

                {children && <div className="mt-5">{children}</div>}

                <AlertDialogFooter className="mt-6 flex-col-reverse sm:flex-row gap-2">
                    <AlertDialogCancel disabled={isPending} className="h-10 mt-0 border-border/80">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        className="h-10 gap-2 bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500/40"
                        onClick={(e) => {
                            // Keep the dialog open until the deletion finishes or fails.
                            e.preventDefault();
                            onConfirm();
                        }}
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isPending ? "Deleting..." : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
