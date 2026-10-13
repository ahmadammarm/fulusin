import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const periods = await getHistoryPeriod(user.id);
        return NextResponse.json(periods);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch periods";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export type GetHistoryPeriodResponseType = Awaited<ReturnType<typeof getHistoryPeriod>>;

async function getHistoryPeriod(userId: string): Promise<number[]> {
    const result = await prisma.monthHistory.findMany({
        where: {
            userId,
        },
        select: {
            year: true,
        },
        distinct: ["year"],
        orderBy: [
            {
                year: "asc",
            },
        ],
    });

    const years = result.map((item: { year: number }) => item.year);

    if (years.length === 0) {
        return [new Date().getFullYear()];
    }

    return years;
}
