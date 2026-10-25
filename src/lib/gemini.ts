import { ApiError, GoogleGenAI, ThinkingLevel, type GenerateContentConfig } from "@google/genai";
import { z } from "zod";

// Server-only module: it reads GEMINI_API_KEY and must never be imported by client components.

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export type AiErrorCode =
    | "not_configured"
    | "quota_exceeded"
    | "rate_limited"
    | "blocked"
    | "invalid_output"
    | "unavailable";

const AI_ERROR_STATUS: Record<AiErrorCode, number> = {
    not_configured: 503,
    quota_exceeded: 429,
    rate_limited: 429,
    blocked: 422,
    invalid_output: 502,
    unavailable: 502,
};

export class AiError extends Error {
    readonly code: AiErrorCode;
    readonly status: number;

    constructor(code: AiErrorCode, message: string) {
        super(message);
        this.name = "AiError";
        this.code = code;
        this.status = AI_ERROR_STATUS[code];
    }
}

/**
 * Maps any error thrown by the Gemini SDK to an AiError with a message that is safe to show users.
 */
export function toAiError(error: unknown): AiError {
    if (error instanceof AiError) return error;

    if (error instanceof ApiError) {
        if (error.status === 429) {
            return new AiError("rate_limited", "The AI service is busy right now. Please try again in a minute.");
        }
        if (error.status === 400 && /safety|blocked/i.test(error.message)) {
            return new AiError("blocked", "This request can't be answered. Please rephrase your question.");
        }
    }

    return new AiError("unavailable", "The AI service is unavailable right now. Please try again later.");
}

type AiThinkingLevel = "low" | "medium";

const THINKING_LEVELS: Record<AiThinkingLevel, ThinkingLevel> = {
    low: ThinkingLevel.LOW,
    medium: ThinkingLevel.MEDIUM,
};

interface GenerateOptions {
    system: string;
    prompt: string;
    thinkingLevel: AiThinkingLevel;
    signal?: AbortSignal;
}

let client: GoogleGenAI | undefined;

function getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new AiError("not_configured", "The AI assistant is not configured on this server.");
    }
    client ??= new GoogleGenAI({ apiKey });
    return client;
}

function buildConfig({ system, thinkingLevel, signal }: GenerateOptions): GenerateContentConfig {
    return {
        systemInstruction: system,
        thinkingConfig: { thinkingLevel: THINKING_LEVELS[thinkingLevel] },
        abortSignal: signal,
    };
}

/**
 * Streams the model's answer as plain text chunks.
 */
export async function* streamText(options: GenerateOptions): AsyncGenerator<string> {
    let stream: AsyncGenerator<{ text?: string }>;
    try {
        stream = await getClient().models.generateContentStream({
            model: GEMINI_MODEL,
            contents: options.prompt,
            config: buildConfig(options),
        });
    } catch (error) {
        throw toAiError(error);
    }

    try {
        for await (const chunk of stream) {
            if (chunk.text) yield chunk.text;
        }
    } catch (error) {
        throw toAiError(error);
    }
}

/**
 * Asks the model for JSON matching `schema` and validates the result, since model output is untrusted.
 */
export async function generateJson<T>(options: GenerateOptions & { schema: z.ZodType<T> }): Promise<T> {
    let text: string | undefined;
    try {
        const response = await getClient().models.generateContent({
            model: GEMINI_MODEL,
            contents: options.prompt,
            config: {
                ...buildConfig(options),
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(options.schema),
            },
        });

        if (response.promptFeedback?.blockReason) {
            throw new AiError("blocked", "This request can't be answered right now.");
        }
        text = response.text;
    } catch (error) {
        throw toAiError(error);
    }

    return parseJsonOutput(text, options.schema);
}

export function parseJsonOutput<T>(text: string | undefined, schema: z.ZodType<T>): T {
    if (!text) {
        throw new AiError("invalid_output", "The AI returned an empty answer. Please try again.");
    }

    let json: unknown;
    try {
        json = JSON.parse(text);
    } catch {
        throw new AiError("invalid_output", "The AI returned an unreadable answer. Please try again.");
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
        throw new AiError("invalid_output", "The AI returned an incomplete answer. Please try again.");
    }
    return parsed.data;
}

/**
 * Turns an error thrown while handling an AI request into a JSON response body and status.
 */
export function aiErrorResponse(error: unknown): { body: { message: string }; status: number } {
    const aiError = toAiError(error);
    if (aiError.code === "unavailable") {
        console.error("AI request failed:", error);
    }
    return { body: { message: aiError.message }, status: aiError.status };
}
