import "dotenv/config";
import prisma from "../src/lib/prisma";
import { getNormalizedHistoryDate } from "../src/lib/dateHelper";
import { addCurrency, roundCurrency } from "../src/lib/financialMath";
import { Prisma } from "../src/generated/prisma/client";

interface AggregationRecord {
    userId: string;
    day?: number;
    month: number;
    year: number;
    income: number;
    expense: number;
}

/**
 * Resyncs historical MonthHistory and YearHistory aggregations.
 * Safe for multi-tenant environments: scopes operations per user to avoid global table wipes.
 *
 * Usage:
 *   npx tsx scripts/resyncHistory.ts
 *   npx tsx scripts/resyncHistory.ts --userId=<userId>
 */
async function resyncHistory() {
    const args = process.argv.slice(2);
    const userIdArg = args.find((a) => a.startsWith("--userId="))?.replace("--userId=", "");

    console.log(
        `Starting historical aggregation resync${
            userIdArg ? ` for user: ${userIdArg}` : " for all users"
        }...`
    );

    // 1. Determine user scope
    const userIds: string[] = [];
    if (userIdArg) {
        userIds.push(userIdArg);
    } else {
        const users = await prisma.user.findMany({ select: { id: true } });
        userIds.push(...users.map((u) => u.id));
    }

    console.log(`Processing ${userIds.length} user account(s)...`);

    for (const userId of userIds) {
        console.log(`\n--- Resyncing history for user: ${userId} ---`);

        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: "asc" },
        });

        console.log(`Found ${transactions.length} transaction(s).`);

        if (transactions.length === 0) {
            // Clean up any stale orphaned history for users with 0 transactions
            await prisma.monthHistory.deleteMany({ where: { userId } });
            await prisma.yearHistory.deleteMany({ where: { userId } });
            console.log(`Cleared empty history records for user: ${userId}`);
            continue;
        }

        const dayAggregations: Record<string, AggregationRecord> = {};
        const monthAggregations: Record<string, AggregationRecord> = {};
        const txIdsToNormalize: { id: string; normalizedDate: Date }[] = [];

        // 2. Accumulate aggregations with safe financial math
        for (const tx of transactions) {
            const { day, month, year, normalizedDate } = getNormalizedHistoryDate(tx.date);

            if (tx.date.getTime() !== normalizedDate.getTime()) {
                txIdsToNormalize.push({ id: tx.id, normalizedDate });
            }

            const safeAmount = roundCurrency(tx.amount);

            // Daily aggregation key
            const dayKey = `${year}-${month}-${day}`;
            if (!dayAggregations[dayKey]) {
                dayAggregations[dayKey] = {
                    userId,
                    day,
                    month,
                    year,
                    income: 0,
                    expense: 0,
                };
            }
            if (tx.type === "income") {
                dayAggregations[dayKey].income = addCurrency(dayAggregations[dayKey].income, safeAmount);
            } else {
                dayAggregations[dayKey].expense = addCurrency(dayAggregations[dayKey].expense, safeAmount);
            }

            // Monthly aggregation key
            const monthKey = `${year}-${month}`;
            if (!monthAggregations[monthKey]) {
                monthAggregations[monthKey] = {
                    userId,
                    month,
                    year,
                    income: 0,
                    expense: 0,
                };
            }
            if (tx.type === "income") {
                monthAggregations[monthKey].income = addCurrency(monthAggregations[monthKey].income, safeAmount);
            } else {
                monthAggregations[monthKey].expense = addCurrency(monthAggregations[monthKey].expense, safeAmount);
            }
        }

        // 3. Atomically update this user's records under transaction isolation
        await prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
                // Batch-update any unaligned transaction dates
                for (const item of txIdsToNormalize) {
                    await tx.transaction.update({
                        where: { id: item.id },
                        data: { date: item.normalizedDate },
                    });
                }

                // Delete ONLY this user's existing history
                await tx.monthHistory.deleteMany({ where: { userId } });
                await tx.yearHistory.deleteMany({ where: { userId } });

                // Bulk insert recalculated MonthHistory
                const dayData = Object.values(dayAggregations).map((d) => ({
                    userId: d.userId,
                    day: d.day ?? 1,
                    month: d.month,
                    year: d.year,
                    income: d.income,
                    expense: d.expense,
                }));
                if (dayData.length > 0) {
                    await tx.monthHistory.createMany({ data: dayData });
                }

                // Bulk insert recalculated YearHistory
                const monthData = Object.values(monthAggregations).map((m) => ({
                    userId: m.userId,
                    month: m.month,
                    year: m.year,
                    income: m.income,
                    expense: m.expense,
                }));
                if (monthData.length > 0) {
                    await tx.yearHistory.createMany({ data: monthData });
                }
            },
            { timeout: 30000 }
        );

        console.log(
            `Successfully resynced: ${Object.keys(dayAggregations).length} day record(s) & ${
                Object.keys(monthAggregations).length
            } month record(s) for user ${userId}.`
        );
    }

    console.log("\nHistorical aggregation resync completed successfully.");
}

resyncHistory()
    .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Resync failed:", message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
