/* eslint-disable @typescript-eslint/no-explicit-any */
import { signOut } from "next-auth/react";
import { toast } from "sonner"
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export default function SignoutButton() {
    const handleSignout = async () => {
        try {
            await signOut({ redirect: true, callbackUrl: "/sign-in" });
            toast.success("Signed out successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to sign out");
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold transition-colors"
                >
                    <LogOut className="mr-2 h-5 w-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to log out?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignout} className="bg-red-500 hover:bg-red-700 text-white transition-colors">
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}