/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcryptjs";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: "/sign-in",
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
                    throw Error("Credentials undefined");
                }

                const schema = z.object({
                    email: z.string().email(),
                    password: z.string().min(6, "Password must be at least 6 characters long"),
                });

                const validation = schema.safeParse(credentials);

                if (!validation.success) {
                    throw Error("Invalid email or password");
                }

                const { email, password }: z.infer<typeof schema> = credentials;

                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                if (!user) {
                    throw Error("Incorrect email");
                }

                const passwordMatch = await compare(password, user.password);

                if (!passwordMatch) {
                    throw Error("Incorrect password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                };
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                },
            };
        },
    },
};

// Use it in server contexts
export function auth(
    ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
    return getServerSession(...args, authOptions);
}