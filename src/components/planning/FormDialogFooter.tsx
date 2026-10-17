"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

interface FormDialogFooterProps {
    isPending: boolean;
    submitLabel: string;
    pendingLabel: string;
}

export default function FormDialogFooter({ isPending, submitLabel, pendingLabel }: FormDialogFooterProps) {
    return (
        <DialogFooter className="pt-4 border-t border-border/60 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5">
            <DialogClose asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="w-full sm:w-auto h-10 text-xs sm:text-sm border-border/80"
                >
                    Cancel
                </Button>
            </DialogClose>
            <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto h-10 px-5 text-xs sm:text-sm font-semibold text-white gap-2 shadow-xs bg-teal-600 hover:bg-teal-700"
            >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isPending ? pendingLabel : submitLabel}</span>
            </Button>
        </DialogFooter>
    );
}
