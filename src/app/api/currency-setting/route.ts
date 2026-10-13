import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
            redirect("/sign-in");
        }

        const currencySetting = await prisma.currencySettings.findUnique({
            where: {
                userId: user.id,
            },
        });

        return NextResponse.json({
            currency: currencySetting?.currency || "USD",
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred while processing your request.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
