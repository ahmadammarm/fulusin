import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import RootProvider from "@/providers/RootProvider";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Fulusin - Your Financial Tracking Assistant",
    description: "Track your finances effortlessly with Fulusin, your AI-powered financial assistant.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextAuthProvider session={session}>
                    <Toaster richColors position="bottom-right" />
                    <RootProvider>
                        {children}
                    </RootProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
