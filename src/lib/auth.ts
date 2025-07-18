import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { User } from "next-auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

interface CustomUser extends User {
    uuid: string;
    role?: string;
}

export async function registerUser(
    email: string,
    password: string,
    name: string,
    role: string = "user"
) {
    const schema = z.object({
        email: z.string().email({ message: "Email is not valid" }),
        password: z.string().min(8, { message: "Minimum password length is 8" }),
        name: z.string().min(2, { message: "Name must be at least 2 characters" }),
        role: z.enum(["user", "admin"], {
            errorMap: () => ({ message: "Role must be either 'user' or 'admin'" }),
        }),
    });

    const result = schema.safeParse({ email, password, name, role });

    if (!result.success) {
        throw new Error(result.error.errors[0].message);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role,
        },
    });

    return {
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
    };
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/sign-in",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@mail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Credentials are missing");
                }

                const schema = z.object({
                    email: z.string().email("Email is not valid"),
                    password: z.string().min(8, "Minimum password length is 8"),
                });

                const result = schema.safeParse(credentials);

                if (!result.success) {
                    throw new Error(result.error.errors[0].message);
                }

                const { email, password } = result.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        uuid: true,
                        email: true,
                        name: true,
                        password: true,
                        role: true,
                    },
                });

                if (!user) {
                    throw new Error("User not found or wrong password");
                }

                const isMatch = await compare(password, user.password);
                if (!isMatch) {
                    throw new Error("User not found or wrong password");
                }

                return {
                    uuid: user.uuid,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                } as CustomUser;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.uuid = (user as CustomUser).uuid;
                token.role = (user as CustomUser).role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.uuid = token.uuid as string;
            session.user.role = token.role as string | undefined;
            return session;
        },
    },
};

export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions);
}