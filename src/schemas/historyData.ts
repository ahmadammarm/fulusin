import z from "zod";

export const getHistoryDataSchema = z.object({
    timeframe: z.enum(["month", "year"]),
    month: z.coerce.number().min(1).max(12).default(1),
    year: z.coerce.number().min(2000).max(3000),
});

export type GetHistoryDataSchemaType = z.infer<typeof getHistoryDataSchema>;