import z from "zod";

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SigninSchemaType = z.infer<typeof SigninSchema>;
