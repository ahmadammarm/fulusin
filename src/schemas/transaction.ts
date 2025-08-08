import z from "zod";

export const CreateTransactionSchema = z.object({
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: z.string().min(1).max(100).optional(),
    date: z.coerce.date(),
    category: z.string(),
    type: z.union([
        z.literal("income"),
        z.literal("expense")
    ])
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;