import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RecurringFrequency } from "@/lib/recurring";
import { TransactionType } from "@/lib/types";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export interface RecurringItem {
    id: string;
    amount: number;
    description: string | null;
    type: TransactionType;
    category: string;
    categoryIcon: string;
    frequency: RecurringFrequency;
    nextDate: string;
}

export type GetRecurringResponseType = RecurringItem[];

export async function GET() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const rules = await prisma.recurringTransaction.findMany({
            where: { userId: user.id },
            orderBy: { nextDate: "asc" },
        });

        const response: GetRecurringResponseType = rules.map((rule) => ({
            id: rule.id,
            amount: rule.amount,
            description: rule.description,
            type: rule.type as TransactionType,
            category: rule.category,
            categoryIcon: rule.categoryIcon,
            frequency: rule.frequency as RecurringFrequency,
            nextDate: rule.nextDate.toISOString(),
        }));

        return NextResponse.json(response);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch recurring transactions";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
