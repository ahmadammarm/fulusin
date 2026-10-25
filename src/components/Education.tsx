"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import AiMarkdown from "./AiMarkdown";
import { EducationQuestionSchema } from "@/schemas/ai";

const SUGGESTED_TOPICS = [
    {
        title: "Understanding Income",
        description:
            "Income is the money you receive from work, business, or investments. It sets how much you can spend, save, and invest.",
    },
    {
        title: "Understanding Expenses",
        description:
            "Expenses are the costs of living and earning income. Managing them well is the foundation of financial stability.",
    },
    {
        title: "Balancing Income and Expenses",
        description:
            "Balancing the two keeps you stable: budgeting, cutting unnecessary costs, and growing your income sources.",
    },
];

export default function Education() {
    const [question, setQuestion] = useState("");
    const [askedQuestion, setAskedQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => () => abortRef.current?.abort(), []);

    const ask = async (rawQuestion: string) => {
        const parsed = EducationQuestionSchema.safeParse({ question: rawQuestion });
        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message || "Invalid question");
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setAskedQuestion(parsed.data.question);
        setAnswer("");
        setIsStreaming(true);

        try {
            const response = await fetch("/api/ai/education", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
                signal: controller.signal,
            });

            if (!response.ok || !response.body) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || "The AI assistant could not answer right now.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                setAnswer((previous) => previous + text);
            }
        } catch (error) {
            if (controller.signal.aborted) return;
            toast.error(error instanceof Error ? error.message : "The AI assistant could not answer right now.");
        } finally {
            if (abortRef.current === controller) {
                abortRef.current = null;
                setIsStreaming(false);
            }
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void ask(question);
    };

    const stop = () => {
        abortRef.current?.abort();
        abortRef.current = null;
        setIsStreaming(false);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about a finance concept, e.g. What is an emergency fund?"
                    maxLength={300}
                    aria-label="Your question"
                    className="h-10"
                />
                {isStreaming ? (
                    <Button type="button" variant="outline" onClick={stop} className="h-10 gap-1.5 shrink-0">
                        <Square className="h-4 w-4" />
                        Stop
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="h-10 gap-1.5 shrink-0 bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        <Send className="h-4 w-4" />
                        Ask
                    </Button>
                )}
            </form>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {SUGGESTED_TOPICS.map((topic) => (
                    <button
                        key={topic.title}
                        type="button"
                        disabled={isStreaming}
                        onClick={() => {
                            setQuestion(topic.title);
                            void ask(topic.title);
                        }}
                        className="p-5 border border-border rounded-xl bg-card hover:bg-muted/60 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <h3 className="text-base font-semibold mb-2">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </button>
                ))}
            </div>

            <div className="p-5 sm:p-6 border border-border rounded-xl bg-card min-h-[160px]" aria-live="polite">
                {askedQuestion && (
                    <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                        <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                        {askedQuestion}
                    </p>
                )}

                {answer ? (
                    <AiMarkdown content={answer} />
                ) : isStreaming ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking...
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Ask a question or pick a topic above to get an explanation.
                    </p>
                )}
            </div>

            <p className="text-xs text-muted-foreground">
                Answers are generated by AI for learning purposes and are not professional financial advice.
            </p>
        </div>
    );
}
