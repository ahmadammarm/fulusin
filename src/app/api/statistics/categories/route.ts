/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { overviewQuerySchema } from "@/schemas/overview";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = await session?.user;

    if (!user) {
        redirect("/signin");
    }

    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const queryParams = overviewQuerySchema.safeParse({ from, to });
        if (!queryParams.success) {
            return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
        }

        const statistics = await getCategoriesStatistics(
            user.id,
            queryParams.data.from,
            queryParams.data.to
        );

        return NextResponse.json(statistics);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export type GetCategoriesStatisticsResponseType = Awaited<ReturnType<typeof getCategoriesStatistics>>;

async function getCategoriesStatistics(userId: string, from: Date, to: Date) {
    const statistics = await prisma.transaction.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: {
            userId,
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        },
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: "desc"
            }
        }
    });

    return statistics
}