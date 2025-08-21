import Header from "@/components/home/Header"
import Hero from "@/components/home/Hero"
import Features from "@/components/home/Features"
import CTA from "@/components/home/CTA"
import Footer from "@/components/home/Footer"

export default function Homepage() {

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Hero />
            <Features />
            <CTA />
            <Footer />
        </div>
    )
}
