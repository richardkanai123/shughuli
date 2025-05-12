"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema, SignUpSchemaType } from "@/lib/validation/schemas";
import toast from "react-hot-toast";

const SignUpForm = () => {
    const Router = useRouter();

    const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const form = useForm<SignUpSchemaType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            username: "",
        },
    });

    const onSubmit = async (data: SignUpSchemaType) => {
        const { email, password, name, username } = data
        try {
            const res = await fetch(`${BASEURL}/api/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    username,
                }),
            });
            const data = await res.json();
            if (res.status !== 200) {
                form.setError("root", { message: data.message as string })
            }
            // send welcome email
            const emailRes = await fetch(`${BASEURL}/api/welcome`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                }),
            })

            const emailResData = await emailRes.json();
            if (emailRes.status !== 200) {
                form.setError("root", { message: emailResData.message as string })
            }

            toast.success("Account created successfully")
            Router.replace('/create-team')

        } catch (error) {
            if (error instanceof Error) {
                form.setError("root", { message: error.message })
            }
            form.setError("root", { message: "Something went wrong, please try again" })
        }
    };

    return (
        <div className="w-full max-w-screen-sm mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                <h3 className="text-3xl font-bold text-white">Sign Up</h3>
                <p className="text-gray-100 mt-2">
                    Join Shughuli and start managing your projects efficiently
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 p-6">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your public username"
                                            {...field}
                                            className="h-11 px-4 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Your unique identifier, minimum 3 characters
                                    </FormDescription>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="eg. John Doe"
                                            {...field}
                                            className="h-11 px-4 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Your fullname displayed on the platform
                                    </FormDescription>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            {...field}
                                            className="h-11 px-4 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        Your email address
                                    </FormDescription>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="h-11 px-4 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        At least 8 characters with letters & numbers
                                    </FormDescription>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Display root-level form errors */}
                    {
                        form.formState.errors.root && <FormMessage className="text-red-500 text-center" >{form.formState.errors.root.message}</FormMessage>
                    }

                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer">
                        {form.formState.isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <span> Create Account</span>
                        )}
                    </Button>
                </form>
            </Form>

            <div className="px-6 pb-6">
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    className="w-full h-11 bg-white/90  hover:bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 text-gray-700 font-semibold border border-gray-200 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer">
                    <FcGoogle className="w-5 h-5" />
                    Sign Up with Google
                </Button>
            </div>

            <div className="w-full pb-4">
                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;