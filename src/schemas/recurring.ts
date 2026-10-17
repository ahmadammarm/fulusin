import z from "zod";
import { RECURRING_FREQUENCIES } from "@/lib/recurring";

export const RecurringCreateSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z.number().positive("Amount must be greater than zero").multipleOf(0.01),
    category: z.string().min(1, "Category is required").max(20),
    description: z.string().trim().max(100).optional(),
    frequency: z.enum(RECURRING_FREQUENCIES),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date is required"),
});

export type RecurringCreateSchemaType = z.infer<typeof RecurringCreateSchema>;

export const RecurringDeleteSchema = z.object({
    id: z.uuid(),
});

export type RecurringDeleteSchemaType = z.infer<typeof RecurringDeleteSchema>;
