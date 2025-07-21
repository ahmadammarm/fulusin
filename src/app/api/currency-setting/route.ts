/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        
        const user = await auth().then(session => {
            if (!session?.user) {
                redirect("/sign-in");
            }
            return session.user;
        });

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