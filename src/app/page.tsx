import Header from "@/components/home/Header"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import Workflow from "@/components/home/Workflow"
import CurrencyPreview from "@/components/home/CurrencyPreview"
import FAQ from "@/components/home/FAQ"
import CTA from "@/components/home/CTA"
import Footer from "@/components/home/Footer"

export default function Homepage() {
    return (
        <div className="min-h-screen bg-background selection:bg-teal-500/20 selection:text-teal-600 dark:selection:text-teal-400">
            <Header />
            <main>
                <Hero />
                <Features />
                <Workflow />
                <CurrencyPreview />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    )
}
