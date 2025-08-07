import z from "zod";

export const CreateTransactionSchema = z.object({
    amount: z.number().positive().multipleOf(0.01),
    description: z.string().min(1).max(100).optional(),
    date: z.date(),
    category: z.string(),
    type: z.union([
        z.literal("income"),
        z.literal("expense")
    ])
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;