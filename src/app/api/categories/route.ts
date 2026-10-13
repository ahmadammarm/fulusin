import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const { searchParams } = new URL(request.url);
        const paramType = searchParams.get("type");

        if (!paramType) {
            return NextResponse.json({ error: "Type parameter is required" }, { status: 400 });
        }

        const validator = z.enum(["income", "expense"]);
        const queryParam = validator.safeParse(paramType);

        if (!queryParam.success) {
            return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
        }

        const type = queryParam.data;

        const categories = await prisma.category.findMany({
            where: {
                userId: user.id,
                ...(type && { type }),
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(categories);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch categories";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
