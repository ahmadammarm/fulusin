import z from "zod";

export const EducationQuestionSchema = z.object({
    question: z
        .string()
        .trim()
        .min(3, "Please ask a slightly longer question.")
        .max(300, "Questions can be at most 300 characters."),
});

export type EducationQuestionSchemaType = z.infer<typeof EducationQuestionSchema>;

const InsightItemSchema = z.object({
    title: z.string().max(120),
    detail: z.string().max(400),
});

export const InsightSchema = z.object({
    summary: z.string().max(600),
    highlights: z.array(InsightItemSchema).max(4),
    warnings: z
        .array(InsightItemSchema.extend({ severity: z.enum(["info", "warning", "critical"]) }))
        .max(4),
    recommendations: z.array(InsightItemSchema).max(4),
});

export type Insight = z.infer<typeof InsightSchema>;
export type InsightSeverity = Insight["warnings"][number]["severity"];
