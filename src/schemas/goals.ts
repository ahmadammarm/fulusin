import z from "zod";

export const GoalUpsertSchema = z.object({
    name: z.string().trim().min(1, "Goal name is required").max(50),
    targetAmount: z.number().positive("Target must be greater than zero").multipleOf(0.01),
    deadline: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
});

export type GoalUpsertSchemaType = z.infer<typeof GoalUpsertSchema>;

export const GoalUpdateSchema = GoalUpsertSchema.extend({
    id: z.uuid(),
});

export type GoalUpdateSchemaType = z.infer<typeof GoalUpdateSchema>;

export const GoalDeleteSchema = z.object({
    id: z.uuid(),
});

export type GoalDeleteSchemaType = z.infer<typeof GoalDeleteSchema>;

export const GoalFundsSchema = z.object({
    id: z.uuid(),
    amount: z.number().positive("Amount must be greater than zero").multipleOf(0.01),
    direction: z.enum(["deposit", "withdraw"]),
});

export type GoalFundsSchemaType = z.infer<typeof GoalFundsSchema>;
