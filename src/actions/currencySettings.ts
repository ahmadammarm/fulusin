/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schemas/currencySettings";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function UpdateUserCurrencyAction(currency: string): Promise<{ userId: string; currency: string }> {
    const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });

    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message || "Invalid currency value");
    }

    const session = await auth();
    const user = session?.user;


    if (!user) {
        redirect("/sign-in");
    }

    try {
        const currencySettings = await prisma.currencySettings.update({
            where: {
                userId: user.id,
            },
            data: {
                currency
            },
        });

        return currencySettings;
    } catch (error: any) {
        throw new Error(error?.message || "An error occurred while updating the currency setting.");
    }
}
