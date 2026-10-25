import { beforeEach, describe, expect, it, vi } from "vitest";

const { upsert } = vi.hoisted(() => ({ upsert: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ default: { aiUsage: { upsert } } }));

import { AI_DAILY_LIMITS, consumeAiQuota, isWithinQuota } from "@/lib/aiQuota";
import { AiError } from "@/lib/gemini";

describe("isWithinQuota", () => {
    it("allows requests up to and including the daily limit", () => {
        expect(isWithinQuota(AI_DAILY_LIMITS.insight, "insight")).toBe(true);
        expect(isWithinQuota(AI_DAILY_LIMITS.insight + 1, "insight")).toBe(false);
    });
});

describe("consumeAiQuota", () => {
    beforeEach(() => upsert.mockReset());

    it("counts usage per WIB day", async () => {
        upsert.mockResolvedValue({ count: 1 });

        // 18:00 UTC on Oct 24 is already Oct 25 in WIB.
        await consumeAiQuota("user-1", "education", new Date("2026-10-24T18:00:00Z"));

        const day = new Date("2026-10-24T17:00:00.000Z");
        expect(upsert).toHaveBeenCalledWith({
            where: { userId_feature_day: { userId: "user-1", feature: "education", day } },
            create: { userId: "user-1", feature: "education", day, count: 1 },
            update: { count: { increment: 1 } },
        });
    });

    it("throws quota_exceeded once the limit is passed", async () => {
        upsert.mockResolvedValue({ count: AI_DAILY_LIMITS.education + 1 });

        await expect(consumeAiQuota("user-1", "education")).rejects.toMatchObject({
            code: "quota_exceeded",
            status: 429,
        });
        await expect(consumeAiQuota("user-1", "education")).rejects.toBeInstanceOf(AiError);
    });
});
