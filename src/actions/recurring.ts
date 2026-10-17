"use server";

import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { roundCurrency } from "@/lib/financialMath";
import { formatWibDate, getNormalizedHistoryDate } from "@/lib/dateHelper";
import { processDueRecurringForUser } from "@/lib/recurringProcessor";
import { RecurringTransaction } from "@/generated/prisma/client";
import {
    RecurringCreateSchema,
    RecurringCreateSchemaType,
    RecurringDeleteSchema,
    RecurringDeleteSchemaType,
} from "@/schemas/recurring";

export interface CreateRecurringResult {
    recurring: RecurringTransaction;
    processedCount: number;
}

export async function CreateRecurringTransactionAction(
    form: RecurringCreateSchemaType
): Promise<CreateRecurringResult> {
    const parsedBody = RecurringCreateSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid recurring transaction data provided");
    }

    const userId = await requireUserId();
    const { type, category, description, frequency, startDate } = parsedBody.data;

    // Past start dates would silently backfill transactions, so schedules start today at the earliest.
    if (startDate < formatWibDate(new Date())) {
        throw new Error("Start date cannot be in the past");
    }

    const categoryRow = await prisma.category.findUnique({
        where: { userId_name_type: { userId, name: category, type } },
    });

    if (!categoryRow) {
        throw new Error(`Category "${category}" not found`);
    }

    const recurring = await prisma.recurringTransaction.create({
        data: {
            userId,
            type,
            frequency,
            amount: roundCurrency(parsedBody.data.amount),
            description: description || null,
            category: categoryRow.name,
            categoryIcon: categoryRow.icon,
            nextDate: getNormalizedHistoryDate(startDate).normalizedDate,
        },
    });

    // A schedule starting today is recorded immediately instead of waiting for the next run.
    const { processedCount } = await processDueRecurringForUser(userId);

    return { recurring, processedCount };
}

export async function DeleteRecurringTransactionAction(
    form: RecurringDeleteSchemaType
): Promise<RecurringTransaction> {
    const parsedBody = RecurringDeleteSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid recurring transaction data provided");
    }

    const userId = await requireUserId();

    return prisma.recurringTransaction.delete({
        where: { id: parsedBody.data.id, userId },
    });
}
