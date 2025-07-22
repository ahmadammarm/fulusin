"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { categorySchema, CategorySchemaType } from "@/schemas/categories";
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