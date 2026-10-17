import z from "zod";

export const BudgetPeriodSchema = z.object({
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000).max(3000),
});

export type BudgetPeriodSchemaType = z.infer<typeof BudgetPeriodSchema>;

// Search params arrive as strings, so the API route coerces them before validating.
export const BudgetPeriodQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2000).max(3000),
});

export const BudgetUpsertSchema = BudgetPeriodSchema.extend({
    category: z.string().min(1, "Category is required").max(20),
    amount: z.number().positive("Limit must be greater than zero").multipleOf(0.01),
});

export type BudgetUpsertSchemaType = z.infer<typeof BudgetUpsertSchema>;

export const BudgetDeleteSchema = z.object({
    id: z.uuid(),
});

export type BudgetDeleteSchemaType = z.infer<typeof BudgetDeleteSchema>;
