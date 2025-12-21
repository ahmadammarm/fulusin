/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WIB_OFFSET } from "@/lib/wib";
import { overviewQuerySchema } from "@/schemas/overview";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

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

        const fromWIB = new Date(from.getTime() + WIB_OFFSET);
        const toWIB = new Date(to.getTime() + WIB_OFFSET);

        // console.log("Original dates:", {
        //     from: from.toISOString(),
        //     to: to.toISOString()
        // });

        // console.log("WIB dates:", {
        //     from: fromWIB.toISOString(),
        //     to: toWIB.toISOString()
        // });

        const startUTC = new Date(Date.UTC(
            fromWIB.getUTCFullYear(),
            fromWIB.getUTCMonth(),
            fromWIB.getUTCDate(),
            0, 0, 0, 0
        ));

        const endUTC = new Date(Date.UTC(
            toWIB.getUTCFullYear(),
            toWIB.getUTCMonth(),
            toWIB.getUTCDate(),
            23, 59, 59, 999
        ));

        // console.log("Query date range (UTC normalized):", {
        //     from: startUTC.toISOString(),
        //     to: endUTC.toISOString()
        // });

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