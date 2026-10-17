import prisma from "@/lib/prisma";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { roundCurrency } from "@/lib/financialMath";
import { incrementHistory } from "@/lib/history";
import { getDueOccurrences, isRecurringFrequency } from "@/lib/recurring";
import { TransactionType } from "@/lib/types";
import { Prisma } from "@/generated/prisma/client";

// Server-only module. It trusts the userId it is given, so it must never be exported
// from a "use server" file; callers are responsible for authenticating that id.

export interface RecurringProcessResult {
    processedCount: number;
    transactionIds: string[];
}

const PROCESSING_TIMEOUT_MS = 60_000;

/**
 * Creates every overdue occurrence of one recurring rule and advances its nextDate.
 * The rule is re-read under the per-user lock so concurrent runs can't create duplicates.
 */
async function processRule(ruleId: string, userId: string, now: Date): Promise<string[]> {
    return prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`tx-lock:${userId}`}))`;

            const rule = await tx.recurringTransaction.findUnique({ where: { id: ruleId, userId } });
            if (!rule || rule.nextDate > now || !isRecurringFrequency(rule.frequency)) {
                return [];
            }

            const { dates, followingDate } = getDueOccurrences(rule.nextDate, rule.frequency, now);
            const amount = roundCurrency(rule.amount);
            const type = rule.type as TransactionType;
            const createdIds: string[] = [];

            for (const occurrence of dates) {
                const { day, month, year, normalizedDate } = getNormalizedHistoryDate(occurrence);

                const transaction = await tx.transaction.create({
                    data: {
                        userId,
                        amount,
                        type,
                        date: normalizedDate,
                        description: rule.description || `Recurring ${rule.frequency} ${rule.category}`,
                        category: rule.category,
                        categoryIcon: rule.categoryIcon,
                    },
                });

                await incrementHistory(tx, { userId, day, month, year, type, amount });
                createdIds.push(transaction.id);
            }

            await tx.recurringTransaction.update({
                where: { id: rule.id },
                data: { nextDate: followingDate },
            });

            return createdIds;
        },
        { timeout: PROCESSING_TIMEOUT_MS }
    );
}

export async function processDueRecurringForUser(
    userId: string,
    now: Date = new Date()
): Promise<RecurringProcessResult> {
    const dueRules = await prisma.recurringTransaction.findMany({
        where: { userId, nextDate: { lte: now } },
        select: { id: true },
        orderBy: { nextDate: "asc" },
    });

    const transactionIds: string[] = [];
    for (const { id } of dueRules) {
        transactionIds.push(...(await processRule(id, userId, now)));
    }

    return { processedCount: transactionIds.length, transactionIds };
}

export async function processDueRecurringForAllUsers(now: Date = new Date()) {
    const users = await prisma.recurringTransaction.findMany({
        where: { nextDate: { lte: now } },
        select: { userId: true },
        distinct: ["userId"],
    });

    let totalProcessed = 0;
    const transactionIds: string[] = [];

    for (const { userId } of users) {
        const result = await processDueRecurringForUser(userId, now);
        totalProcessed += result.processedCount;
        transactionIds.push(...result.transactionIds);
    }

    return { usersCount: users.length, totalProcessed, transactionIds };
}
