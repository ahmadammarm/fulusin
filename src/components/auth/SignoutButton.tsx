/* eslint-disable @typescript-eslint/no-explicit-any */
import { signOut } from "next-auth/react";
import { toast } from "sonner"
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

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
        <Button className="text-md text-white font-bold bg-red-500 hover:bg-red-600 transition-all duration-150 ease-in-out px-4 py-2" onClick={handleSignout}>
            <LogOut className="mr-2 h-5 w-5" />
        </Button>
    )
}