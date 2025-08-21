import { TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function Hero() {
    return (
        <section className="py-20 px-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
            <div className="container mx-auto relative z-10">
                <Badge className="mb-6 bg-accent/20 text-muted-foreground border-accent/30">Web-based Financial Tracker</Badge>
                <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-teal-300 via-teal-800 to-teal-400 bg-clip-text text-transparent leading-tight">
                    Master Your Money,
                    <br />
                    <span className="text-accent">Period by Period</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    Take control of your financial future with Fulusin&apos;s intelligent budget tracking. Analyze spending patterns,
                    set goals, and make informed decisions within specific timeframes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-accent text-teal-500 hover:bg-accent/90 text-lg px-8 py-4">
                        Start Tracking Free
                        <TrendingUp className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    )
}