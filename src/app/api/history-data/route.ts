/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { getDaysInMonth } from "date-fns"

export async function GET(request: NextRequest) {
    const session = await auth()
    const user = session?.user

    if (!user) {
        redirect("/sign-in")
    }

    try {
        const { searchParams } = new URL(request.url)
        const timeframe = searchParams.get("timeframe")
        const year = Number(searchParams.get("year"))
        const month = Number(searchParams.get("month"))

        let data: any[] = []

        if (timeframe === "year") {
            data = await getYearHistory(user.id, year)
        }

        if (timeframe === "month") {
            data = await getMonthHistory(user.id, year, month)
        }

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

export type GetHistoryDataResponseType =
    | Awaited<ReturnType<typeof getMonthHistory>>
    | Awaited<ReturnType<typeof getYearHistory>>

/**
 * Reads pre-aggregated YearHistory rows for the specified year.
 * O(1) database lookup returning an array of 12 month records.
 */
async function getYearHistory(userId: string, year: number) {
    const yearRecords = await prisma.yearHistory.findMany({
        where: {
            userId,
            year,
        },
    })

    const history = Array.from({ length: 12 }, (_, i) => ({
        year,
        month: i + 1,
        income: 0,
        expense: 0,
    }))

    for (const record of yearRecords) {
        if (record.month >= 1 && record.month <= 12) {
            history[record.month - 1].income = record.income
            history[record.month - 1].expense = record.expense
        }
    }

    return history
}

/**
 * Reads pre-aggregated MonthHistory rows for the specified year and month.
 * O(1) database lookup returning an array of day records for that month.
 */
async function getMonthHistory(userId: string, year: number, month: number) {
    const daysInMonth = getDaysInMonth(new Date(year, month - 1))

    const monthRecords = await prisma.monthHistory.findMany({
        where: {
            userId,
            year,
            month,
        },
    })

    const history = Array.from({ length: daysInMonth }, (_, i) => ({
        year,
        month,
        day: i + 1,
        income: 0,
        expense: 0,
    }))

    for (const record of monthRecords) {
        if (record.day >= 1 && record.day <= daysInMonth) {
            history[record.day - 1].income = record.income
            history[record.day - 1].expense = record.expense
        }
    }

    return history
}
