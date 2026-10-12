"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { categorySchema, CategorySchemaType, CategoryDeleteSchema, CategoryDeleteSchemaType } from "@/schemas/categories";
import { redirect } from "next/navigation";

export async function CreateCategoryAction(form: CategorySchemaType) {
    const parsedBody = categorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid category data");
    }

    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect('/sign-in');
    }

    const { name, icon, type } = parsedBody.data;

    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        }
    })
}

export async function CategoryDelete(form: CategoryDeleteSchemaType) {

    const parsedBody = CategoryDeleteSchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error("Invalid category data");
    }

    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect('/sign-in');
    }

    const { name, type } = parsedBody.data;

    // Guard: Prevent foreign key constraint violation if active transactions reference this category
    const transactionCount = await prisma.transaction.count({
        where: {
            userId: user.id,
            category: name,
            type,
        },
    });

    if (transactionCount > 0) {
        throw new Error(
            `Cannot delete category "${name}" because it is currently used by ${transactionCount} transaction${transactionCount === 1 ? "" : "s"}. Please delete or reassign those transactions first.`
        );
    }

    return await prisma.category.delete({
        where: {
            userId_name_type: {
                userId: user.id,
                name,
                type,
            }
        }
    })
}