/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/prisma';
import { getHistoryDataSchema } from './../../../schemas/historyData';
import { auth } from "@/lib/auth";
import { HistoryData, Period, Timeframe } from '@/lib/types';
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getDaysInMonth } from 'date-fns';

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect('/sign-in');
    }

    try {
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe');
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        // console.log("API timeframe param =", timeframe);

        const queryParams = getHistoryDataSchema.safeParse({
            timeframe,
            month,
            year
        });

        if (!queryParams.success) {
            return NextResponse.json({ error: queryParams.error.message }, { status: 400 });
        }

        const data = await getHistoryData(
            user.id,
            queryParams.data.timeframe,
            {
                month: queryParams.data.month,
                year: queryParams.data.year
            }
        );

        // console.log("API returning data =", data);

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "An error occurred while fetching history data."
        }, { status: 500 });
    }
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>;

async function getYearHistoryData(userId: string, year: number) {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: { userId, year },
        _sum: { income: true, expense: true },
        orderBy: { month: "asc" }
    });

    const history: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
        const row = result.find((r: any) => r.month === i + 1);
        history.push({
            income: row?._sum.income ?? 0,
            expense: row?._sum.expense ?? 0,
            year,
            month: i + 1
        });
    }

    return history;
}

async function getMonthHistoryData(userId: string, year: number, month: number) {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: { userId, year, month },
        _sum: { income: true, expense: true },
        orderBy: [{ day: "asc" }]
    });

    const history: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    for (let i = 1; i <= daysInMonth; i++) {
        const row = result.find((r: any) => r.day === i);
        history.push({
            income: row?._sum.income ?? 0,
            expense: row?._sum.expense ?? 0,
            year,
            month,
            day: i
        });
    }

    return history;
}

async function getHistoryData(userId: string, timeframe: Timeframe, period: Period) {
    console.log("📌 getHistoryData received timeframe =", timeframe);

    switch (timeframe) {
        case "year":
            return await getYearHistoryData(userId, period.year);

        case "month":
            return await getMonthHistoryData(userId, period.year, period.month);

        default:
            // console.warn("Invalid timeframe received:", timeframe);
            return [];
    }
}
