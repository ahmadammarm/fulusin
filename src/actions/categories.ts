/* eslint-disable @typescript-eslint/no-explicit-any */
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

    return await prisma.category.delete({
        where: {
            userId_name_type: {
                userId: user.id,
                name: parsedBody.data.name,
                type: parsedBody.data.type,
            }
        }
    })
}