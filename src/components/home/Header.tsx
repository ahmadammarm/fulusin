"use client";

import { useState } from "react";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

export default function Header() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    const handleSignin = () => router.push("/sign-in");
    const handleDashboard = () => router.push("/dashboard");

    const isAuthenticated = status === "authenticated" && session?.user?.id;

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "Workflow", href: "#workflow" },
        { label: "Currencies", href: "#currencies" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md relative">
            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 origin-left z-50 shadow-xs shadow-teal-500/50"
                style={{ scaleX }}
            />

            <div className="container mx-auto px-4 sm:px-6 h-16 relative flex items-center justify-between">
                {/* Brand Logo */}
                <div className="flex items-center">
                    <Logo />
                </div>

                {/* Centered Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors relative py-1"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Action Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    {status === "loading" ? (
                        <div className="h-9 w-24 rounded-lg bg-muted/60 animate-pulse" />
                    ) : isAuthenticated ? (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="sm"
                                className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm cursor-pointer"
                                onClick={handleDashboard}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                                <ArrowRight className="h-3.5 w-3.5 ml-0.5 opacity-80" />
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 text-xs sm:text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={handleSignin}
                            >
                                Sign In
                            </Button>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    size="sm"
                                    className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white shadow-xs gap-1.5 font-medium text-xs sm:text-sm cursor-pointer"
                                    onClick={() => router.push("/sign-up")}
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Trigger */}
                <div className="flex sm:hidden items-center">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu with Fluid AnimatePresence */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                        className="sm:hidden border-b border-border/60 bg-card/95 backdrop-blur-md overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
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
                                        className="w-full bg-teal-600 text-white justify-center cursor-pointer"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleDashboard();
                                        }}
                                    >
                                        Go to Dashboard
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center cursor-pointer"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                handleSignin();
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            className="w-full bg-teal-600 text-white justify-center cursor-pointer"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                router.push("/sign-up");
                                            }}
                                        >
                                            Create Free Account
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
