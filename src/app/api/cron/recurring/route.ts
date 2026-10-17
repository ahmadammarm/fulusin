import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { processDueRecurringForAllUsers, processDueRecurringForUser } from "@/lib/recurringProcessor";

function hasValidCronSecret(request: NextRequest): boolean {
    const cronSecret = process.env.CRON_SECRET;
    return Boolean(cronSecret) && request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

async function processAllUsers() {
    try {
        const result = await processDueRecurringForAllUsers();
        return NextResponse.json({ success: true, ...result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Recurring cron processing failed";
        console.error("Cron recurring execution error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * Vercel Cron entry point. Vercel calls this with GET and sends `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: NextRequest) {
    if (!hasValidCronSecret(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return processAllUsers();
}

/**
 * Manual trigger: processes every user with a valid CRON_SECRET, or only the signed-in user otherwise.
 */
export async function POST(request: NextRequest) {
    if (hasValidCronSecret(request)) {
        return processAllUsers();
    }

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. Provide a valid CRON_SECRET or sign in." },
                { status: 401 }
            );
        }

        const result = await processDueRecurringForUser(session.user.id);
        return NextResponse.json({ success: true, ...result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Recurring processing failed";
        console.error("Recurring execution error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
