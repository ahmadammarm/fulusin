import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { overviewQuerySchema } from "@/schemas/overview";
import { getWibDateRange } from "@/lib/dateHelper";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export interface CategoryStatisticItem {
    type: string;
    category: string;
    categoryIcon: string;
    _sum: {
        amount: number | null;
    };
}

export type GetCategoriesStatisticsResponseType = CategoryStatisticItem[];

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
            return NextResponse.json(
                { error: queryParams.error.issues[0]?.message || "Invalid query parameters" },
                { status: 400 }
            );
        }

        const statistics = await getCategoriesStatistics(
            user.id,
            queryParams.data.from,
            queryParams.data.to
        );

        return NextResponse.json(statistics);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch categories statistics";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function getCategoriesStatistics(
    userId: string,
    from: Date,
    to: Date
): Promise<CategoryStatisticItem[]> {
    const { start, end } = getWibDateRange(from, to);

    const statistics = await prisma.transaction.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: {
            userId,
            date: {
                gte: start,
                lte: end,
            },
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: "desc",
            },
        },
    });

    return statistics;
}
