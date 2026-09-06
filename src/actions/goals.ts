"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function CreateGoalAction(name: string, targetAmount: number, deadline?: Date) {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    return prisma.goal.create({
        data: {
            userId: user.id,
            name,
            targetAmount,
            deadline,
        }
    });
}

export async function GetGoalsAction() {
    const session = await auth();
    const user = session?.user;
    if (!user) return [];

    return prisma.goal.findMany({
        where: { userId: user.id },
    });
}

export async function UpdateGoalProgressAction(id: string, amountToAdd: number) {
    const session = await auth();
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    return prisma.goal.update({
        where: { id, userId: user.id },
        data: {
            currentAmount: { increment: amountToAdd }
        }
    });
}
