/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getDaysInMonth } from "date-fns";

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get("timeframe");
        const year = Number(searchParams.get("year"));
        const month = Number(searchParams.get("month"));

        let data: any[] = [];

        if (timeframe === "year") {
            data = await getYearHistoryFromTransaction(user.id, year);
        }

        if (timeframe === "month") {
            data = await getMonthHistoryFromTransaction(user.id, year, month);
        }

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getMonthHistoryFromTransaction>> | Awaited<ReturnType<typeof getYearHistoryFromTransaction>>;

async function getYearHistoryFromTransaction(userId: string, year: number) {
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31, 23, 59, 59),
            },
        },
    });

    const history = Array.from({ length: 12 }, (_, i) => ({
        year,
        month: i + 1,
        income: 0,
        expense: 0,
    }));

    for (const trx of transactions) {
        const monthIndex = trx.date.getMonth();
        if (trx.type === "income") {
            history[monthIndex].income += trx.amount;
        } else {
            history[monthIndex].expense += trx.amount;
        }
    }

    return history;
}

async function getMonthHistoryFromTransaction(
    userId: string,
    year: number,
    month: number
) {
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month - 1, daysInMonth, 23, 59, 59),
            },
        },
    });

    const history = Array.from({ length: daysInMonth }, (_, i) => ({
        year,
        month,
        day: i + 1,
        income: 0,
        expense: 0,
    }));

    for (const trx of transactions) {
        const dayIndex = trx.date.getDate() - 1;
        if (trx.type === "income") {
            history[dayIndex].income += trx.amount;
        } else {
            history[dayIndex].expense += trx.amount;
        }
    }

    return history;
}
