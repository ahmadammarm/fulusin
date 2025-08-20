"use client"

import { SigninSchema, SigninSchemaType } from "@/schemas/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

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
        <div className="min-h-screen flex flex-col lg:flex-row bg-cover bg-center overflow-hidden bg-transparent">

            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                <Image
                    src="/assets/sign-in-baner.jpg"
                    alt="Login Illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={800}
                    height={600}
                />
                <div className="absolute inset-0 bg-black/80"></div>

                <div className="absolute bottom-10 left-8 right-8 text-white text-4xl font-semibold text-left">
                    Solusi pintar untuk mengelola keuangan Anda.
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center p-6 min-h-screen lg:min-h-0">
                <div className="w-full bgtransparent rounded-none lg:rounded-l-2xl p-10 shadow-lg">
                    <h1 className="text-3xl font-bold mb-6">
                        Selamat Datang di <span className="text-teal-500">Fulusin</span>
                    </h1>

                    <h2 className="text-md text-white mb-6">
                        Silakan masuk menggunakan akun Anda
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className={`w-full p-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className={`w-full p-2 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <a
                                className="underline text-sm text-gray-300 hover:text-gray-600"
                                href="/register"
                            >
                                Buat Akun Baru
                            </a>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className={`ml-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300 ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {mutation.isPending ? "Signing in..." : "Masuk"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
