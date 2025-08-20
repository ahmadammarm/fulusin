"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { SignupSchema, SignupSchemaType } from '../../schemas/signupSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SignupAction } from "@/actions/signup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image";
import Link from "next/link";


export default function SignupForm() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(SignupSchema),
    })

    const mutation = useMutation({
        mutationFn: ({ email, name, password, confirmPassword }: SignupSchemaType) =>
            SignupAction(email, name, password, confirmPassword),
        onSuccess: () => {
            toast.success("User signup successfully!")
            router.push("/sign-in")
        },
        onError: (error: Error) => {
            toast.error(`Registration failed: ${error.message}`)
        },
    })

    const onSubmit = (data: SignupSchemaType) => {
        mutation.mutate(data)
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-cover bg-center overflow-hidden bg-transparent">

            {/* right section */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                <Image src="/assets/sign-up-banner.jpg" alt="Signup banner" className="aboslute inset-0 w-full h-full object-cover" width={800} height={600} />

                <div className="absolute inset-0 bg-black/80"></div>

                <div className="absolute bottom-10 left-8 right-8 text-white text-4xl font-semibold text-left">
                    Kelola keuangan dengan mudah dan aman bersama kami.
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center p-6 min-h-screen lg:min-h-0">
                <div className="w-full bg-transparent p-10 shadow-lg">
                    <h1 className="text-3xl font-bold mb-10">
                        Daftar Sekarang di <span className="text-teal-500">Fulusin</span>
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="name"
                                placeholder="Full name"
                                {...register("name")}
                                className={`w-full p-2 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>

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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Konfirmasi Password"
                                {...register("confirmPassword")}
                                className={`w-full p-2 rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <Link
                                className="underline text-sm text-gray-300 hover:text-gray-600"
                                href="/sign-in"
                            >
                                Sudah punya akun? Masuk
                            </Link>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className={`ml-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300 ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {mutation.isPending ? "Signing up..." : "Daftar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}