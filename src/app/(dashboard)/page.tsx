/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    try {
        const user = await currentUser();

        if (!user) {
            redirect("/sign-in");
        }

        const currencySettings = await prisma.currencySettings.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!currencySettings) {
            redirect("/wizard");
        }

    } catch (error: any) {
        console.error("Error fetching user data:", error);
    }

    return (
        <div>
            Hello Page
        </div>
    )
}