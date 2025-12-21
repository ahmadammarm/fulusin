/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { overviewQuerySchema } from "@/schemas/overview";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay, startOfMonth } from "date-fns";

export async function GET(request: NextRequest) {
    const session = await auth();

    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const queryParams = overviewQuerySchema.safeParse({ from, to });

        if (!queryParams.success) {
            return NextResponse.json({
                error: queryParams.error.message
            }, { status: 400 });
        }

        const statistics = await getBalanceStatistics(
            user.id,
            queryParams.data.from,
            queryParams.data.to
        );

        return NextResponse.json(statistics);

    } catch (error: any) {
        console.error("Error fetching balance statistics:", error);
        return NextResponse.json({
            error: "Failed to fetch balance statistics."
        }, { status: 500 });
    }
}

export type BalanceStatistics = Awaited<ReturnType<typeof getBalanceStatistics>>;

async function getBalanceStatistics(userId: string, from: Date, to: Date) {
    try {
        const timezone = "Asia/Jakarta";

        const fromDate = from.getDate() === 1 ? startOfMonth(from) : from;

        const startLocal = startOfDay(fromDate);
        const endLocal = endOfDay(to);

        const startUTC = fromZonedTime(startLocal, timezone);
        const endUTC = fromZonedTime(endLocal, timezone);

        const total = await prisma.transaction.groupBy({
            by: ["type"],
            where: {
                userId,
                date: {
                    gte: startUTC,
                    lte: endUTC,
                },
            },
            _sum: {
                amount: true,
            },
        });

        return {
            expense: total.find(t => t.type === "expense")?._sum.amount ?? 0,
            income: total.find(t => t.type === "income")?._sum.amount ?? 0,
        };
    } catch (error) {
        console.error("Error in getBalanceStatistics:", error);
        throw new Error("Failed to fetch balance statistics.");
    }
}