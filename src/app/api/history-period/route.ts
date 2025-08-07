import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    const periods = await getHistoryPeriod(user.id);
    return NextResponse.json(periods);

}

export type GetHistoryPeriodResponseType = Awaited<ReturnType<typeof getHistoryPeriod>>;

async function getHistoryPeriod(userId: string) {
    const result = await prisma.monthHistory.findMany({
        where: {
            userId: userId
        },
        select: {
            year: true,
        },
        distinct: ["year"],
        orderBy: [
            {
                year: "asc"
            }
        ]
    })

    const years = result.map(item => item.year);

    if (years.length === 0) {
        return [new Date().getFullYear()];
    }

    return years;

}