"use server";

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schemas/currencySettings";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CurrencySettings } from "@/generated/prisma/client";

export async function UpdateUserCurrencyAction(currency: string): Promise<CurrencySettings> {
    const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });

    if (!parsedBody.success) {
        throw new Error(parsedBody.error.issues[0]?.message || "Invalid currency value");
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
        throw new Error("User account not found in the database.");
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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred while updating the currency setting.";
        throw new Error(message);
    }
}
