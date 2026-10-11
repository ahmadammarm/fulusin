"use client"

import { useState } from "react"
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react"
import Logo from "../Logo"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Header() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSignin = () => router.push("/sign-in")
    const handleDashboard = () => router.push("/dashboard")

    const isAuthenticated = status === "authenticated" && session?.user?.id

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "Workflow", href: "#workflow" },
        { label: "Currencies", href: "#currencies" },
        { label: "FAQ", href: "#faq" },
    ]

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <div className="flex items-center gap-8">
                    <Logo />

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Action Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    {status === "loading" ? (
                        <div className="h-9 w-24 rounded-lg bg-muted/60 animate-pulse" />
                    ) : isAuthenticated ? (
                        <Button
                            size="sm"
                            className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm"
                            onClick={handleDashboard}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                            <ArrowRight className="h-3.5 w-3.5 ml-0.5 opacity-80" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                                onClick={handleSignin}
                            >
                                Sign In
                            </Button>
                            <Button
                                size="sm"
                                className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm"
                                onClick={() => router.push("/sign-up")}
                            >
                                <span>Get Started</span>
                                <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Trigger */}
                <div className="flex sm:hidden items-center gap-2">
                    {isAuthenticated && (
                        <Button
                            size="sm"
                            className="h-8 px-3 text-xs bg-teal-600 text-white"
                            onClick={handleDashboard}
                        >
                            Dashboard
                        </Button>
                    )}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-b border-border/60 bg-card p-4 space-y-3">
                    <nav className="flex flex-col space-y-2.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground py-1 px-2 rounded-md hover:bg-muted/40 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-3 border-t border-border/40 flex flex-col gap-2">
                        {isAuthenticated ? (
                            <Button
                                className="w-full bg-teal-600 text-white justify-center"
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    handleDashboard()
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center"
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        handleSignin()
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="w-full bg-teal-600 text-white justify-center"
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        router.push("/sign-up")
                                    }}
                                >
                                    Create Free Account
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
