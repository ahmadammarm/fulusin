import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ProcessDueRecurringTransactionsAction } from "@/actions/recurringExecution";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        // Check secret if configured
        const isAuthorizedSecret =
            cronSecret && authHeader === `Bearer ${cronSecret}`;

        if (!isAuthorizedSecret) {
            // Fallback: Check if active user session is authenticated
            const session = await auth();
            if (!session?.user?.id) {
                return NextResponse.json(
                    { error: "Unauthorized. Provide a valid CRON_SECRET or sign in." },
                    { status: 401 }
                );
            }

            // Process for authenticated user
            const result = await ProcessDueRecurringTransactionsAction(session.user.id);
            return NextResponse.json(result);
        }

        // If authorized via CRON_SECRET, process all users with due recurring rules
        const usersWithDueRecurring = await prisma.recurringTransaction.findMany({
            where: {
                nextDate: {
                    lte: new Date(),
                },
            },
            select: {
                userId: true,
            },
            distinct: ["userId"],
        });

        let totalProcessed = 0;
        const allCreatedIds: string[] = [];

        for (const { userId } of usersWithDueRecurring) {
            const res = await ProcessDueRecurringTransactionsAction(userId);
            totalProcessed += res.processedCount;
            allCreatedIds.push(...res.transactionIds);
        }

        return NextResponse.json({
            success: true,
            usersCount: usersWithDueRecurring.length,
            totalProcessed,
            transactionIds: allCreatedIds,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Recurring cron processing failed";
        console.error("Cron recurring execution error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
