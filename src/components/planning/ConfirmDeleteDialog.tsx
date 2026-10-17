"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: string;
    isPending: boolean;
    onConfirm: () => void;
}

export default function ConfirmDeleteDialog({
    open,
    setOpen,
    title,
    description,
    isPending,
    onConfirm,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
                <AlertDialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <AlertDialogTitle className="text-lg font-bold text-foreground">{title}</AlertDialogTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">Permanent action confirmation</p>
                        </div>
                    </div>
                    <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 text-left">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        className="bg-destructive hover:bg-destructive/90 text-white gap-2 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {title}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
