import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import RootProvider from "@/providers/RootProvider";
import { authOptions } from "@/lib/auth";


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
                className={`${poppins.className} antialiased`}
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
