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
                    Manage your finances easily and securely with <span className="text-teal-500">Fulusin</span>
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center p-6 min-h-screen lg:min-h-0">
                <div className="w-full bg-transparent p-10 shadow-lg">
                    <h1 className="text-3xl font-bold mb-10 md:px-10">
                        Sign Up
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:px-10">
                        <div className="space-y-2">
                            <Input
                                id="name"
                                type="text"
                                placeholder="Full name"
                                {...register("name")}
                                className={`w-full h-12 rounded-lg border p-5 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className={`w-full h-12 rounded-lg border p-5 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className={`w-full h-12 rounded-lg border p-5 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Password Confirm"
                                {...register("confirmPassword")}
                                className={`w-full h-12 rounded-lg border p-5 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <Link
                                className="underline text-sm text-gray-300 hover:text-gray-600"
                                href="/sign-in"
                            >
                                Already have an account? Sign in
                            </Link>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className={`ml-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300 ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {mutation.isPending ? "Signing up..." : "Sign up"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}