"use client"

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CTA() {

    const router = useRouter();

    const { status } = useSession();

    const handleSigninRedirect = () => {
        router.push('/sign-in')
    }

    const handleDashboardRedirect = () => {
        router.push('/dashboard')
    }

    return (
        <section className="py-20 px-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                    Ready to Transform Your <span className="text-teal-500">Financial Future</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join thousands of users who have already taken control of their finances with Fulusin
                </p>
                {status === "authenticated" ? (
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-12 py-4" onClick={handleDashboardRedirect}>
                        Go to Dashboard
                    </Button>
                ) : (
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-12 py-4" onClick={handleSigninRedirect}>
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                )}
            </div>
        </section >
    )
}