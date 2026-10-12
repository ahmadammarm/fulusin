import "dotenv/config";
import prisma from "../src/lib/prisma";
import { getNormalizedHistoryDate } from "../src/lib/dateHelper";

async function resyncHistory() {
    console.log("Starting historical aggregation resync...");

    const transactions = await prisma.transaction.findMany({
        orderBy: { date: "asc" },
    });

    console.log(`Found ${transactions.length} total transactions to process.`);

    if (transactions.length === 0) {
        console.log("No transactions to process.");
        return;
    }

    const dayAggregations: Record<
        string,
        { userId: string; day: number; month: number; year: number; income: number; expense: number }
    > = {};

    const monthAggregations: Record<
        string,
        { userId: string; month: number; year: number; income: number; expense: number }
    > = {};

    // 1. Process each transaction and fix date if needed
    for (const tx of transactions) {
        const { day, month, year, normalizedDate } = getNormalizedHistoryDate(tx.date);

        // Update transaction.date in DB if not aligned to normalizedDate
        if (tx.date.getTime() !== normalizedDate.getTime()) {
            await prisma.transaction.update({
                where: { id: tx.id },
                data: { date: normalizedDate },
            });
        }

        // Daily aggregation key
        const dayKey = `${tx.userId}-${year}-${month}-${day}`;
        if (!dayAggregations[dayKey]) {
            dayAggregations[dayKey] = {
                userId: tx.userId,
                day,
                month,
                year,
                income: 0,
                expense: 0,
            };
        }
        if (tx.type === "income") {
            dayAggregations[dayKey].income += tx.amount;
        } else {
            dayAggregations[dayKey].expense += tx.amount;
        }

        // Monthly aggregation key
        const monthKey = `${tx.userId}-${year}-${month}`;
        if (!monthAggregations[monthKey]) {
            monthAggregations[monthKey] = {
                userId: tx.userId,
                month,
                year,
                income: 0,
                expense: 0,
            };
        }
        if (tx.type === "income") {
            monthAggregations[monthKey].income += tx.amount;
        } else {
            monthAggregations[monthKey].expense += tx.amount;
        }
    }

    console.log(`Recalculated ${Object.keys(dayAggregations).length} day history records.`);
    console.log(`Recalculated ${Object.keys(monthAggregations).length} year history records.`);

    // 2. Atomically replace MonthHistory and YearHistory
    await prisma.$transaction(
        async (tx: any) => {
            // Clear existing aggregations
            await tx.monthHistory.deleteMany({});
            await tx.yearHistory.deleteMany({});

            // Bulk insert fresh MonthHistory
            await tx.monthHistory.createMany({
                data: Object.values(dayAggregations),
            });

            // Bulk insert fresh YearHistory
            await tx.yearHistory.createMany({
                data: Object.values(monthAggregations),
            });
        },
        { timeout: 30000 }
    );

    console.log("Successfully resynced MonthHistory and YearHistory.");
}

resyncHistory()
    .catch((err) => {
        console.error("Resync failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
