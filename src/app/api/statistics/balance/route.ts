import { auth } from "@/lib/auth";
import { overviewQuerySchema } from "@/schemas/overview";
import { getBalanceStatistics } from "@/lib/statistics";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type { BalanceStatistics } from "@/lib/statistics";

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
