/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in")
    }

    try {
        const transaction = await getTransactionHistory(user.id);
        return NextResponse.json(transaction);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export type GetTransactionHistoryResponse = Awaited<ReturnType<typeof getTransactionHistory>>;

async function getTransactionHistory(userId: string) {
    const currencySettings = await prisma.currencySettings.findUnique({
        where: {
            userId
        }
    });

    if (!currencySettings) {
        throw new Error("Currency settings not found");
    }

    const formatter = GetFormatterForCurrency(currencySettings.currency);

    const transaction = await prisma.transaction.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: "desc",
        }
    });

    return transaction.map((transaction: any) => ({
        ...transaction,
        formattedAmount: formatter.format(transaction.amount),
    }))
}