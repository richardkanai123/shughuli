'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { useSearchParams } from "next/navigation"
import { Mail, Loader2, Send } from "lucide-react"

const ResetPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

const ResetPasswordForm = () => {
    const searchParams = useSearchParams()
    const emailParam = searchParams.get('email')

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: emailParam || '',
        },
    })

    const onSubmit = async (data: ResetPasswordInput) => {
        console.log(data)
        try {
            // TODO: Implement password reset logic
            toast.success("If an account exists with this email, you will receive reset instructions.")
            form.reset()
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong. Please try again.")
        }
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">
                                    Email address
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10 h-11"
                                            autoComplete="email"
                                            autoFocus
                                        />
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
                        type="submit"
                        disabled={form.formState.isLoading || form.formState.isSubmitting}
                        className="w-full h-11"
                        size="lg"
                    >
                        {form.formState.isLoading || form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending instructions...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Reset Instructions
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            {/* Help text */}
            <div className="text-center">
                <p className="text-xs text-muted-foreground">
                    You'll receive an email with instructions to reset your password if an account exists with this email address.
                </p>
            </div>
        </div>
    )
}

export default ResetPasswordForm