import { auth } from "@/lib/auth";
import { overviewQuerySchema } from "@/schemas/overview";
import { CategoryStatisticItem, getCategoriesStatistics } from "@/lib/statistics";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type { CategoryStatisticItem } from "@/lib/statistics";

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
