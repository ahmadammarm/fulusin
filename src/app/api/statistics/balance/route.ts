import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { overviewQuerySchema } from "@/schemas/overview";
import { getWibDateRange } from "@/lib/dateHelper";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { roundCurrency } from "@/lib/financialMath";

export interface BalanceStatistics {
    expense: number;
    income: number;
}

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
                { error: queryParams.error.issues[0]?.message || "Invalid date range parameters" },
                { status: 400 }
            );
        }

        const statistics = await getBalanceStatistics(
            user.id,
            queryParams.data.from,
            queryParams.data.to
        );

        return NextResponse.json(statistics);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch balance statistics.";
        console.error("Error fetching balance statistics:", message);
        return NextResponse.json(
            { error: "Failed to fetch balance statistics." },
            { status: 500 }
        );
    }
}

async function getBalanceStatistics(userId: string, from: Date, to: Date): Promise<BalanceStatistics> {
    const { start, end } = getWibDateRange(from, to);

    const totals = await prisma.transaction.groupBy({
        by: ["type"],
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
    });

    const expenseRecord = totals.find((t) => t.type === "expense");
    const incomeRecord = totals.find((t) => t.type === "income");

    return {
        expense: roundCurrency(expenseRecord?._sum.amount ?? 0),
        income: roundCurrency(incomeRecord?._sum.amount ?? 0),
    };
}
