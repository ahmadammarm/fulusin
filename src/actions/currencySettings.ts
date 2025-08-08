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

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (!existingUser) {
        throw new Error("User not found in the database.");
    }

    try {
        const currencySettings = await prisma.currencySettings.upsert({
            where: {
                userId: user.id,
            },
            update: {
                currency,
            },
            create: {
                userId: user.id,
                currency,
            },
        });

        return currencySettings;
    } catch (error: any) {
        throw new Error(error?.message || "An error occurred while updating the currency setting.");
    }
}
