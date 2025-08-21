"use client"


import { ArrowRight } from "lucide-react";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Header() {

    const router = useRouter();

    const handleSignin = () => {
        router.push('/sign-in');
    }
    
    return (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Logo />
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" onClick={handleSignin}>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </header>
    )
}