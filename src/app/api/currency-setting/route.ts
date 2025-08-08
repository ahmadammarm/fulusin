/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
            redirect("/sign-in");
        }

        const currencySetting = await prisma.currencySettings.upsert({
            where: {
                userId: user.id,
            },
            update: {},
            create: {
                userId: user.id,
                currency: "USD",
            },
        });

        revalidatePath("/");

        return NextResponse.json({
            currency: currencySetting.currency,
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error?.message || "An error occurred while processing your request."
        }, { status: 500 });
    }
}
