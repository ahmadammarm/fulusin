/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function TransactionDelete(id: string) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction || transaction.userId !== user.id) {
            throw new Error("Transaction not found or unauthorized");
        }

        await prisma.$transaction([
            prisma.transaction.delete({
                where: { id },
            }),

            prisma.monthHistory.update({
                where: {
                    userId_day_month_year: {
                        userId: user.id,
                        day: transaction.date.getUTCDate(),
                        month: transaction.date.getUTCMonth() + 1,
                        year: transaction.date.getUTCFullYear(),
                    },
                },
                data: {
                    ...(transaction.type === "income" && {
                        income: { decrement: transaction.amount },
                    }),
                    ...(transaction.type === "expense" && {
                        expense: { decrement: transaction.amount },
                    }),
                },
            }),

            prisma.yearHistory.update({
                where: {
                    userId_month_year: {
                        userId: user.id,
                        month: transaction.date.getUTCMonth() + 1,
                        year: transaction.date.getUTCFullYear(),
                    },
                },
                data: {
                    ...(transaction.type === "income" && {
                        income: { decrement: transaction.amount },
                    }),
                    ...(transaction.type === "expense" && {
                        expense: { decrement: transaction.amount },
                    }),
                },
            }),
        ]);

    } catch (error: any) {
        console.error("Error deleting transaction:", error);
    }
}
