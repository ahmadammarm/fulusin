import prisma from "@/lib/prisma";
import { getNormalizedHistoryDate } from "@/lib/dateHelper";
import { AiError } from "@/lib/gemini";

export type AiFeature = "education" | "insight";

/** Requests each user may make per WIB calendar day. */
export const AI_DAILY_LIMITS: Record<AiFeature, number> = {
    education: 30,
    insight: 10,
};

export function isWithinQuota(count: number, feature: AiFeature): boolean {
    return count <= AI_DAILY_LIMITS[feature];
}

/**
 * Counts one AI request against today's quota and throws when the quota is used up.
 * The upsert increments atomically, so concurrent requests can't both slip under the limit.
 */
export async function consumeAiQuota(userId: string, feature: AiFeature, now: Date = new Date()): Promise<void> {
    const day = getNormalizedHistoryDate(now).normalizedDate;

    const usage = await prisma.aiUsage.upsert({
        where: { userId_feature_day: { userId, feature, day } },
        create: { userId, feature, day, count: 1 },
        update: { count: { increment: 1 } },
    });

    if (!isWithinQuota(usage.count, feature)) {
        throw new AiError(
            "quota_exceeded",
            `You have reached today's limit of ${AI_DAILY_LIMITS[feature]} AI requests. It resets at midnight WIB.`
        );
    }
}
