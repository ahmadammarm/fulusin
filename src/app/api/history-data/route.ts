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
        redirect('/sign-in')
    }

    try {
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe');
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        const queryParams = getHistoryDataSchema.safeParse({
            timeframe,
            month,
            year
        });

        if (!queryParams.success) {
            return NextResponse.json(queryParams.error.message, {
                status: 400
            })
        }

        const data = await getHistoryData(user.id, queryParams.data.timeframe, {
            month: queryParams.data.month,
            year: queryParams.data.year
        })

        return NextResponse.json(data);

        
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "An error occurred while fetching history data."
        });
    }
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>;

async function getYearHistoryData(userId: string, year: number) {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year
        },
        _sum: {
            income: true,
            expense: true,
        },
        orderBy: {
            month: "asc"
        }
    })

    if (!result || result.length === 0) {
        return [];
    }

    const history: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
        let income = 0;
        let expense = 0;

        const month = result.find((row) => row.month === i + 1);

        if (month) {
            income = month._sum.income || 0;
            expense = month._sum.expense || 0;
        }

        history.push({
            income,
            expense,
            year,
            month: i + 1
        });
    }

    return history;

}

async function getMonthHistoryData(userId: string, year: number, month: number) {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            year,
            month
        },
        _sum: {
            income: true,
            expense: true,
        },
        orderBy: [
            {
                day: "asc"
            }
        ]
    })

    if (!result || result.length === 0) {
        return [];
    }

    const history: HistoryData[] = [];

    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 1; i <= daysInMonth; i++) {
        let income = 0;
        let expense = 0;

        const day = result.find((row) => row.day === i);

        if (day) {
            income = day._sum.income || 0;
            expense = day._sum.expense || 0;
        }

        history.push({
            income,
            expense,
            year,
            month,
            day: i
        });
    }

    return history;
}

async function getHistoryData(userId: string, timeframe: Timeframe, period: Period) {
    switch (timeframe) {
        case "year":
            return await getYearHistoryData(userId, period.year)
        case "month":
            return await getMonthHistoryData(userId, period.year, period.month);
    }
}