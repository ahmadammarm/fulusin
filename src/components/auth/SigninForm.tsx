"use client"

import { SigninSchema, SigninSchemaType } from "@/schemas/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SigninForm() {

    const user = useSession().data?.user;
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const { register, handleSubmit, formState: { errors } } = useForm<SigninSchemaType>({
        resolver: zodResolver(SigninSchema),
    });

    const mutation = useMutation({
        mutationFn: async ({ data }: { data: SigninSchemaType }) => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            return result;
        },
        onSuccess: () => {
            toast.success("Signed in successfully!");
            router.push("/dashboard");
        },
        onError: (error: Error) => {
            toast.error(`Sign in failed: ${error.message}`);
        },
    });

    const onSubmit = (data: SigninSchemaType) => {
        mutation.mutate({ data });
    };

    return (
        <div className="w-full max-w-md mx-auto mt-5">
            <Card className="border-green-200 shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent">Sign In</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        Enter your email and password to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-teal-500 font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-green-300'}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-teal-500 font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-green-300'}`}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className={`w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {mutation.isPending ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}