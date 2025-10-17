"use client"


import { ArrowRight, Github } from "lucide-react";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {

    const router = useRouter();

    const { status } = useSession();

    const handleSignin = () => {
        router.push('/sign-in');
    }

    const handleDashboard = () => {
        router.push('/dashboard');
    }

    const handleGithub = () => {
        window.open('https://github.com/ahmadammarm/fulusin', '_blank');
    }

    return (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Logo />
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" className="bg-transparent" onClick={handleGithub}>
                        <Github className="w-4 h-4" />
                    </Button>
                    {status === "authenticated" ? (
                        <Button variant="outline" className="bg-transparent" onClick={handleDashboard}>
                            Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button variant="outline" className="bg-transparent" onClick={handleSignin}>
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}