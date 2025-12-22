"use client";

import { SigninSchema, SigninSchemaType } from "@/schemas/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function SigninForm() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    const { register, handleSubmit, formState: { errors } } =
        useForm<SigninSchemaType>({
            resolver: zodResolver(SigninSchema),
        });

    const mutation = useMutation({
        mutationFn: async (data: SigninSchemaType) => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            toast.success("Signed in successfully!");
            router.replace("/dashboard");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const handleGoogleSignin = async () => {
        setIsGoogleLoading(true);
        await signIn("google", {
            callbackUrl: "/dashboard",
        });
    };

    if (status === "loading") return null;

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <div className="hidden lg:flex lg:w-1/2 relative">
                <Image
                    src="/assets/sign-in-baner.jpg"
                    alt="Login Illustration"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/80" />
                <div className="absolute bottom-10 left-8 right-8 text-white text-4xl font-semibold">
                    A smart solution to manage your finances.
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center p-6">
                <div className="w-full p-10">
                    <h1 className="text-3xl font-bold mb-10">Sign in</h1>

                    <Button
                        type="button"
                        onClick={handleGoogleSignin}
                        disabled={isGoogleLoading}
                        className="w-full h-12 flex gap-3 mb-6"
                    >
                        {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                    </Button>

                    <form
                        onSubmit={handleSubmit((data) => mutation.mutate(data))}
                        className="space-y-4"
                    >
                        <Input placeholder="Email" {...register("email")} />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                        <Input
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500">{errors.password.message}</p>
                        )}

                        <div className="flex justify-between items-center">
                            <Link href="/sign-up" className="underline text-sm">
                                Don&apos;t have an account? Sign Up
                            </Link>

                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Signing in..." : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
