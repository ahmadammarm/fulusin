import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export interface GoalItem {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string | null;
}

export type GetGoalsResponseType = GoalItem[];

export async function GET() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const goals = await prisma.goal.findMany({
            where: { userId: user.id },
            orderBy: [{ deadline: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
        });

        const response: GetGoalsResponseType = goals.map((goal) => ({
            id: goal.id,
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline?.toISOString() ?? null,
        }));

        return NextResponse.json(response);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch goals";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
