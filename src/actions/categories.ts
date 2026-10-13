"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    categorySchema,
    CategorySchemaType,
    CategoryDeleteSchema,
    CategoryDeleteSchemaType,
} from "@/schemas/categories";
import { redirect } from "next/navigation";
import { Category } from "@/generated/prisma/client";

export async function CreateCategoryAction(form: CategorySchemaType): Promise<Category> {
    const parsedBody = categorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid category data provided");
    }

    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    const { name, icon, type } = parsedBody.data;

    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        },
    });
}

export async function CategoryDelete(form: CategoryDeleteSchemaType): Promise<Category> {
    const parsedBody = CategoryDeleteSchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error("Invalid category data provided");
    }

    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    const { name, type } = parsedBody.data;

    // Referential integrity check across Transaction, Budget, and RecurringTransaction
    const [transactionCount, budgetCount, recurringCount] = await Promise.all([
        prisma.transaction.count({
            where: {
                userId: user.id,
                category: name,
                type,
            },
        }),
        prisma.budget.count({
            where: {
                userId: user.id,
                category: name,
            },
        }),
        prisma.recurringTransaction.count({
            where: {
                userId: user.id,
                category: name,
                type,
            },
        }),
    ]);

    const blockers: string[] = [];
    if (transactionCount > 0) {
        blockers.push(`${transactionCount} transaction${transactionCount === 1 ? "" : "s"}`);
    }
    if (budgetCount > 0) {
        blockers.push(`${budgetCount} monthly budget limit${budgetCount === 1 ? "" : "s"}`);
    }
    if (recurringCount > 0) {
        blockers.push(`${recurringCount} automated recurring schedule${recurringCount === 1 ? "" : "s"}`);
    }

    if (blockers.length > 0) {
        throw new Error(
            `Cannot delete category "${name}" because it is currently referenced by ${blockers.join(
                ", "
            )}. Please delete or reassign those records first.`
        );
    }

    return await prisma.category.delete({
        where: {
            userId_name_type: {
                userId: user.id,
                name,
                type,
            },
        },
    });
}
