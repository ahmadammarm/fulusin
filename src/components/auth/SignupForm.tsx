"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { SignupSchema, SignupSchemaType } from '../../schemas/signupSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SignupAction } from "@/actions/signup";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Mail, UserIcon, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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
        <div className="w-full max-w-md mx-auto mt-5">
            <Card className="border-teal-200 shadow-lg">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-teal-600 font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    disabled={mutation.isPending}
                                    className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-teal-600 font-medium">
                                Name
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    disabled={mutation.isPending}
                                    className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-teal-600 font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    disabled={mutation.isPending}
                                    className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-teal-600 font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    disabled={mutation.isPending}
                                    className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 text-white font-medium py-2.5 transition-colors"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}