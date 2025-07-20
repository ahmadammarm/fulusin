"use server"

import prisma from "@/lib/prisma";
import { SignupSchema } from "@/schemas/signupSchema";
import { hash } from "bcryptjs";

export async function SignupAction(email: string, name: string, password: string, confirmPassword: string) {
    try {
        const parsedBody = SignupSchema.safeParse({ email, name, password, confirmPassword });
        if (!parsedBody.success) {
            throw new Error("Invalid input");
        }

        const { email: validEmail, name: validName, password: validPassword, confirmPassword: validConfirmPassword } = parsedBody.data;

        if (validPassword !== validConfirmPassword) {
            throw new Error("Passwords do not match");
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: validEmail },
        });


        if (existingUser) {
            throw new Error("User with this email already exists");
        }


        const hashedPassword = await hash(validPassword, 10);

        const user = await prisma.user.create({
            data: {
                email: validEmail,
                name: validName,
                password: hashedPassword,
            },
        });

        return user;
    } catch (error) {
        throw new Error((error as Error).message || "Registration failed");
    }
}