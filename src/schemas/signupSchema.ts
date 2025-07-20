import z from "zod";

export const SignupSchema = z
    .object({
        email: z.email("Invalid email address"),
        name: z.string().min(3, "Name must be at least 3 characters long"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignupSchemaType = z.infer<typeof SignupSchema>;