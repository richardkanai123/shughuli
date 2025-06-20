'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { BetterAuthError } from "better-auth"
import { signInSchema, SignInSchemaType } from '@/lib/validation/schemas'
import GoogleAuthBtn from '../Buttons/GoogleAuthBtn'
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useState } from "react";

const SignInForm = () => {
    const Router = useRouter()
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data: SignInSchemaType) => {
        try {
            const { error } = await signIn.email({
                email: data.email,
                password: data.password,
                rememberMe: true
            }, {
                onSuccess: () => {
                    toast.success(`Logged in`, {
                        icon: '🔓'
                    })
                    Router.push("/dashboard")
                },
            })
            if (error) {
                if (error instanceof Error || BetterAuthError) {
                    toast.error(error.message as string)
                    form.setError('root', { message: error.message as string })
                    return
                }
                toast.error("Something went wrong!")
                return
            }

        } catch (error) {
            if (error instanceof Error) {
                form.setError('root', { message: error.message })
                toast.error(error.message)
                return
            }
            toast.error("Something went wrong!")
            form.setError('root', { message: 'An unknown error occurred!, please try again' })
            return
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Sign in to Shughuli and start managing your projects efficiently
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type='email'
                                                    placeholder="your@email.com"
                                                    {...field}
                                                    className="pl-10 h-11"
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="pl-10 pr-10 h-11"
                                                    autoComplete="current-password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Form error display */}
                            {form.formState.errors.root && (
                                <div className="rounded-md bg-destructive/15 p-3">
                                    <FormMessage className="text-destructive font-medium">
                                        {form.formState.errors.root.message}
                                    </FormMessage>
                                </div>
                            )}

                            <Button
                                disabled={form.formState.isSubmitting}
                                type="submit"
                                className="w-full h-11"
                                size="lg"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-2 text-sm text-center">
                        <div>
                            <span className="text-muted-foreground">Don't have an account? </span>
                            <Link href="/sign-up" className="text-primary hover:text-primary/80 underline-offset-4 hover:underline">
                                Sign up
                            </Link>
                        </div>
                        <div>
                            <Link 
                                href={`/reset-password?email=${form.getValues('email')}`} 
                                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Auth */}
                    <GoogleAuthBtn />
                </CardContent>
            </Card>
        </div>
    )
}

export default SignInForm