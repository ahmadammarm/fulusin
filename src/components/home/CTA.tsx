"use client";

import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function CTA() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const isAuthenticated = status === "authenticated" && session?.user?.id;

    const handleCTA = () => {
        if (isAuthenticated) {
            router.push("/dashboard");
        } else {
            router.push("/sign-up");
        }
    };

    return (
        <section className="py-20 md:py-28 bg-card/40 border-b border-border/60 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    className="max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card p-8 sm:p-12 md:p-16 text-center shadow-lg relative overflow-hidden backdrop-blur-xs"
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                >
                    {/* Multi-layered Pulsing Aurora Glow */}
                    <motion.div
                        className="absolute -top-28 -left-28 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-28 -right-28 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.25, 0.55, 0.25],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <div className="space-y-6 max-w-2xl mx-auto relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                            Take control of your finances with{" "}
                            <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                                total confidence.
                            </span>
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                            Stop guessing where your money went. Experience atomic transaction tracking, instant chart rendering,
                            and bank statement imports in one focused dashboard.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 gap-2 cursor-pointer"
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
                            </motion.div>
                        </div>

                        {/* Trust proof points */}
                        <motion.div
                            className="pt-4 hidden sm:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                                Instant setup in 60 seconds
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                                Export your data anytime
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
