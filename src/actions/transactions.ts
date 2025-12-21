"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    CreateTransactionSchema,
    CreateTransactionSchemaType,
} from "@/schemas/transaction";
import { redirect } from "next/navigation";
import { startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

function normalizeDateToUTC(date: Date): Date {
    const localStart = startOfDay(date);
    return fromZonedTime(localStart, TIMEZONE);
}

export async function CreateTransactionAction(
    form: CreateTransactionSchemaType
) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid data");
    }

    const session = await auth();
    const user = session?.user;
    if (!user) {
        redirect("/sign-in");
    }

    const { amount, category, date, description, type } = parsedBody.data;

    const normalizedDate = normalizeDateToUTC(new Date(date));

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        },
    });

    if (!categoryRow) {
        throw new Error("Category not found");
    }

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                date: normalizedDate,
                description: description || "",
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
            },
        }),

        prisma.monthHistory.upsert({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: normalizedDate.getUTCDate(),
                    month: normalizedDate.getUTCMonth() + 1,
                    year: normalizedDate.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                day: normalizedDate.getUTCDate(),
                month: normalizedDate.getUTCMonth() + 1,
                year: normalizedDate.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                income: {
                    increment: type === "income" ? amount : 0,
                },
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
            },
        }),

        prisma.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: normalizedDate.getUTCMonth() + 1,
                    year: normalizedDate.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                month: normalizedDate.getUTCMonth() + 1,
                year: normalizedDate.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                income: {
                    increment: type === "income" ? amount : 0,
                },
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
            },
        }),
    ]);
}
