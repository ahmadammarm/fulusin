"use client"

import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CTA() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const isAuthenticated = status === "authenticated" && session?.user?.id

    const handleCTA = () => {
        if (isAuthenticated) {
            router.push("/dashboard")
        } else {
            router.push("/sign-up")
        }
    }

    return (
        <section className="py-20 md:py-28 bg-card/40 border-b border-border/60">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card p-8 sm:p-12 md:p-16 text-center shadow-sm">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-medium">
                            <span>Zero Cost Onboarding</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                            Take control of your finances with{" "}
                            <span className="text-teal-600 dark:text-teal-400">
                                total confidence.
                            </span>
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                            Stop guessing where your money went. Experience atomic transaction tracking, instant chart rendering,
                            and bank statement imports in one focused dashboard.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs gap-2"
                                onClick={handleCTA}
                            >
                                {isAuthenticated ? (
                                    <>
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Go to Dashboard</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Free Account</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Trust proof points */}
                        <div className="pt-4 hidden sm:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                                Instant setup in 60 seconds
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                                Export your data anytime
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
