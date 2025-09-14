import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, PieChart, TrendingUp, Users, Shield, Zap } from "lucide-react"


export default function Features() {
    return (
        <section className="py-20 px-4 bg-card/30">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">
                        Everything You Need to <span className="text-teal-500">Succeed</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed to help you understand and optimize your financial habits
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="bg-card border-border hover:border-teal-500/50 transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500/30 transition-colors">
                                <Calendar className="w-6 h-6 text-teal-500" />
                            </div>
                            <CardTitle className="text-foreground">Period-Based Tracking</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Organize your finances by custom time periods - monthly or annual analysis
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <PieChart className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-foreground">Smart Analytics</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Get detailed insights into spending patterns with interactive charts and reports
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-card border-border hover:border-teal-500/50 transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500/30 transition-colors">
                                <TrendingUp className="w-6 h-6 text-teal-500" />
                            </div>
                            <CardTitle className="text-foreground">Goal Setting</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Set and track financial goals with progress monitoring and achievement rewards
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-foreground">Secure & Private</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Your data is protected with privacy controls
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-card border-border hover:border-teal-500/50 transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500/30 transition-colors">
                                <Users className="w-6 h-6 text-teal-500" />
                            </div>
                            <CardTitle className="text-foreground">Multi-User Support</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Share budgets with family members or manage multiple financial accounts
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-card border-border hover:border-accent/50 transition-all duration-300 group">
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-foreground">
                                Fast & Intuitive
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                User-friendly design for quick setup and effortless navigation
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </section>
    )
}