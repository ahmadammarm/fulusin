import Logo from "../Logo"
import Link from "next/link"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border/80 text-foreground pt-14 pb-10">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-4 max-w-sm">
                        <Logo />
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            A high-speed personal financial engine engineered for period-by-period precision,
                            atomic history aggregation, and total cash flow transparency.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Product
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                            <li>
                                <Link href="#features" className="hover:text-foreground transition-colors">
                                    Bento Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#workflow" className="hover:text-foreground transition-colors">
                                    4-Step Workflow
                                </Link>
                            </li>
                            <li>
                                <Link href="#currencies" className="hover:text-foreground transition-colors">
                                    Currency Engine
                                </Link>
                            </li>
                            <li>
                                <Link href="#faq" className="hover:text-foreground transition-colors">
                                    Frequently Asked Questions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Ledger Platform
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                                    Overview Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/transactions" className="hover:text-foreground transition-colors">
                                    Transaction Ledger
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/manage" className="hover:text-foreground transition-colors">
                                    Category Channels
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-in" className="hover:text-foreground transition-colors">
                                    User Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>
                        &copy; {currentYear} Fulusin. All rights reserved.
                    </p>

                    <div className="flex items-center gap-1">
                        <span>Crafted by</span>
                        <Link
                            href="https://ahmadammar.my.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
                        >
                            Ahmad Ammar
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
