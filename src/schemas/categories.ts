import z from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(20),
    icon: z.string().max(20),
    type: z.enum(["income", "expense"])
})

export type CategorySchemaType = z.infer<typeof categorySchema>;