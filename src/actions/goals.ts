"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { roundCurrency } from "@/lib/financialMath";
import { Goal } from "@/generated/prisma/client";

export async function CreateGoalAction(
    name: string,
    targetAmount: number,
    deadline?: Date
): Promise<Goal> {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const safeTarget = roundCurrency(targetAmount);
    if (safeTarget <= 0) {
        throw new Error("Target amount must be greater than zero");
    }

    return prisma.goal.create({
        data: {
            userId: user.id,
            name: name.trim(),
            targetAmount: safeTarget,
            deadline,
        },
    });
}

export async function GetGoalsAction(): Promise<Goal[]> {
    const session = await auth();
    const user = session?.user;
    if (!user) return [];

    return prisma.goal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function UpdateGoalProgressAction(id: string, amountToAdd: number): Promise<Goal> {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const safeAmount = roundCurrency(amountToAdd);

    return prisma.goal.update({
        where: { id, userId: user.id },
        data: {
            currentAmount: { increment: safeAmount },
        },
    });
}
