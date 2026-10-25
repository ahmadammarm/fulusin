import { auth } from "@/lib/auth";
import { BudgetWithProgress, getBudgetsWithProgress } from "@/lib/statistics";
import { BudgetPeriodQuerySchema } from "@/schemas/budgets";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type { BudgetWithProgress } from "@/lib/statistics";

export type GetBudgetsResponseType = BudgetWithProgress[];

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = BudgetPeriodQuerySchema.safeParse({
            month: searchParams.get("month"),
            year: searchParams.get("year"),
        });

        if (!queryParams.success) {
            return NextResponse.json(
                { error: queryParams.error.issues[0]?.message || "Invalid query parameters" },
                { status: 400 }
            );
        }

        const { month, year } = queryParams.data;
        const budgets = await getBudgetsWithProgress(user.id, month, year);

        return NextResponse.json(budgets);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch budgets";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
