import Education from "@/components/Education";
import { GraduationCap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Education",
    description: "Learn personal finance concepts with an AI assistant.",
};

export default function EducationPage() {
    return (
        <div className="min-h-full bg-background pb-12">
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Financial Education</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
                        Ask about any personal finance concept and get a structured explanation with practical examples.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <Education />
            </div>
        </div>
    );
}
