/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { overviewQuerySchema } from "@/schemas/overview";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns";

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

        const indonesiaTimezone = "Asia/Jakarta";


        const startIndonesia = startOfDay(from);
        const endIndonesia = endOfDay(to);


        const startUTC = fromZonedTime(startIndonesia, indonesiaTimezone);
        const endUTC = fromZonedTime(endIndonesia, indonesiaTimezone);

        const totale = await prisma.transaction.groupBy({
            by: ["type"],
            where: {
                userId,
                date: {
                    gte: startUTC,
                    lte: endUTC,
                }
            },
            _sum: {
                amount: true,
            },
        });

        return {
            expense: totale.find((t: any) => t.type === "expense")?._sum.amount || 0,
            income: totale.find((t: any) => t.type === "income")?._sum.amount || 0,
        };
    } catch (error) {
        console.error("Error in getBalanceStatistics:", error);
        throw new Error("Failed to fetch balance statistics.");
    }
}