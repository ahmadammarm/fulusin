"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { addCurrency, roundCurrency, subtractCurrency } from "@/lib/financialMath";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { Goal, Prisma } from "@/generated/prisma/client";
import {
    GoalDeleteSchema,
    GoalDeleteSchemaType,
    GoalFundsSchema,
    GoalFundsSchemaType,
    GoalUpdateSchema,
    GoalUpdateSchemaType,
    GoalUpsertSchema,
    GoalUpsertSchemaType,
} from "@/schemas/goals";

function toGoalData({ name, targetAmount, deadline }: GoalUpsertSchemaType) {
    return {
        name,
        targetAmount: roundCurrency(targetAmount),
        deadline: deadline ? getNormalizedHistoryDate(deadline).normalizedDate : null,
    };
}

export async function CreateGoalAction(form: GoalUpsertSchemaType): Promise<Goal> {
    const parsedBody = GoalUpsertSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid goal data provided");
    }

    const userId = await requireUserId();

    return prisma.goal.create({
        data: { userId, ...toGoalData(parsedBody.data) },
    });
}

export async function UpdateGoalAction(form: GoalUpdateSchemaType): Promise<Goal> {
    const parsedBody = GoalUpdateSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid goal data provided");
    }

    const userId = await requireUserId();
    const { id, ...goal } = parsedBody.data;

    return prisma.goal.update({
        where: { id, userId },
        data: toGoalData(goal),
    });
}

export async function UpdateGoalFundsAction(form: GoalFundsSchemaType): Promise<Goal> {
    const parsedBody = GoalFundsSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid goal funds data provided");
    }

    const userId = await requireUserId();
    const { id, amount, direction } = parsedBody.data;

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Serialize concurrent fund updates so a withdrawal check can't be raced.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`goal-lock:${id}`}))`;

        const goal = await tx.goal.findUnique({ where: { id, userId } });
        if (!goal) {
            throw new Error("Goal not found");
        }

        if (direction === "withdraw" && amount > goal.currentAmount) {
            throw new Error("You cannot withdraw more than the amount saved in this goal");
        }

        const currentAmount =
            direction === "deposit"
                ? addCurrency(goal.currentAmount, amount)
                : subtractCurrency(goal.currentAmount, amount);

        return tx.goal.update({
            where: { id },
            data: { currentAmount },
        });
    });
}

export async function DeleteGoalAction(form: GoalDeleteSchemaType): Promise<Goal> {
    const parsedBody = GoalDeleteSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid goal data provided");
    }

    const userId = await requireUserId();

    return prisma.goal.delete({
        where: { id: parsedBody.data.id, userId },
    });
}
