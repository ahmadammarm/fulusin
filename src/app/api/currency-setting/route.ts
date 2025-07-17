/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            redirect("/sign-in");
        }

        let currencySetting = await prisma.currencySettings.findUnique({
            where: {
                userId: user.id,
            }
        });

        if (!currencySetting) {
            currencySetting = await prisma.currencySettings.create({
                data: {
                    userId: user.id,
                    currency: "USD",
                }
            });
        }

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