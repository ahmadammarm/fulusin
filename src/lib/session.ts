import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Returns the signed-in user's id, redirecting to sign-in when there is no session.
 */
export async function requireUserId(): Promise<string> {
    const session = await auth();
    if (!session?.user) {
        redirect("/sign-in");
    }
    return session.user.id;
}
