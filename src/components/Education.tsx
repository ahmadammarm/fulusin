"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function Education() {
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleCardClick = async (topic: string) => {
        console.log(`Clicked on: ${topic}`);
        setLoading(true);
        setOutput("");

        try {
            const response = await fetch("/api/ai-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userQuestion: topic }),
            });

            const data = await response.json();

            const text =
                data?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
                data?.message ||
                "No output from Gemini.";

            setOutput(text);
        } catch (error) {
            console.error(error);
            setOutput("Error fetching response from AI Assistant.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Button
                    onClick={() => handleCardClick("Understanding Income")}
                    className="p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors text-left"
                >
                    <h3 className="text-lg font-semibold mb-4">Understanding Income</h3>
                    <p className="text-sm text-muted-foreground">
                        Income refers to the money that an individual or business receives
                        in exchange for providing goods or services, or through investing
                        capital. It determines the ability to cover expenses, save, and
                        invest for future growth.
                    </p>
                </Button>

                <Button
                    onClick={() => handleCardClick("Understanding Expenses")}
                    className="p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors text-left"
                >
                    <h3 className="text-lg font-semibold mb-4">Understanding Expenses</h3>
                    <p className="text-sm text-muted-foreground">
                        Expenses are the costs incurred by an individual or business in the
                        process of earning income. Managing them effectively is essential
                        for profitability and stability.
                    </p>
                </Button>

                <Button
                    onClick={() => handleCardClick("Balancing Income and Expenses")}
                    className="p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors text-left"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Balancing Income and Expenses
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Balancing income and expenses is crucial for maintaining financial
                        stability. It involves budgeting, reducing unnecessary expenses, and
                        increasing income sources.
                    </p>
                </Button>
            </div>

            <div className="p-6 border border-border rounded-lg bg-muted/50 min-h-[150px] whitespace-pre-wrap">
                {loading ? (
                    <p className="text-sm text-muted-foreground italic">
                        Generating response from Gemini...
                    </p>
                ) : output ? (
                    <p className="text-base">{output}</p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Click one of the cards above to get insights from Gemini.
                    </p>
                )}
            </div>
        </div>
    );
}
