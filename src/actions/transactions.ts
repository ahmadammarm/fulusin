"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { redirect } from "next/navigation";


export async function CreateTransactionAction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid data");
    }

    const session = await auth();

    const user = session?.user;
    if (!user) {
        redirect("sign-in");
    }

    const { amount, category, date, description, type } = parsedBody.data;

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        }
    })

    if (!categoryRow) {
        throw new Error("Category not found");
    }

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                date,
                description: description || "",
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
            }
        }),

        prisma.monthHistory.upsert({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                expense: type === "expense" ? {
                    increment: amount
                } : 0,
                income: type === "income" ? {
                    increment: amount
                } : 0,
            }
        }),
        prisma.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                expense: type === "expense" ? {
                    increment: amount
                } : 0,
                income: type === "income" ? {
                    increment: amount
                } : 0,
            }
        })
    ])
}