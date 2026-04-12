import Logo from "../Logo";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-12 px-4 bg-card border-t border-border">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Logo />
                </div>
                <p className="text-muted-foreground mb-4">
                    Empowering individuals to make smarter financial decisions, one period at a time.
                </p>
            </div>
            <div className="container mx-auto text-center">
                <p className="text-muted-foreground">
                    &copy; {new Date().getFullYear()} Fulusin. All rights reserved.
                </p>
                <p className="text-muted-foreground text-sm mt-4">
                    Developed by{" "}
                    <Link
                        href="https://ahmadammar.my.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent hover:underline"
                    >
                        Ahmad Ammar
                    </Link>
                </p>
            </div>
        </footer>
    )
}