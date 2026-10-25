import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ApiError } from "@google/genai";
import { AiError, aiErrorResponse, parseJsonOutput, toAiError } from "@/lib/gemini";

const Schema = z.object({ summary: z.string() });

describe("parseJsonOutput", () => {
    it("returns data that matches the schema", () => {
        expect(parseJsonOutput('{"summary":"ok"}', Schema)).toEqual({ summary: "ok" });
    });

    it.each([
        ["empty output", undefined],
        ["malformed JSON", "{summary:"],
        ["JSON that misses required fields", '{"other":1}'],
    ])("rejects %s as invalid_output", (_label, text) => {
        expect(() => parseJsonOutput(text, Schema)).toThrow(AiError);
        try {
            parseJsonOutput(text, Schema);
        } catch (error) {
            expect((error as AiError).code).toBe("invalid_output");
        }
    });
});

describe("toAiError", () => {
    it("maps a 429 from Gemini to rate_limited", () => {
        const error = toAiError(new ApiError({ message: "Resource exhausted", status: 429 }));
        expect(error.code).toBe("rate_limited");
        expect(error.status).toBe(429);
    });

    it("keeps AiError instances as they are", () => {
        const original = new AiError("quota_exceeded", "limit");
        expect(toAiError(original)).toBe(original);
    });

    it("hides unknown errors behind a generic message", () => {
        const error = toAiError(new Error("socket hang up at 10.0.0.1"));
        expect(error.code).toBe("unavailable");
        expect(error.message).not.toContain("10.0.0.1");
    });
});

describe("aiErrorResponse", () => {
    it("returns the user-safe message and status", () => {
        expect(aiErrorResponse(new AiError("quota_exceeded", "Daily limit reached"))).toEqual({
            body: { message: "Daily limit reached" },
            status: 429,
        });
    });
});
