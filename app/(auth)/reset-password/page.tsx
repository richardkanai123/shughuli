import ResetPasswordForm from "@/components/Public_Components/Forms/ResetPasswordForm"
import LoadingSpinner from "@/components/Public_Components/Loaders/LoadSpinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { KeyRound, ArrowLeft, UserPlus } from "lucide-react"

const ResetPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
            <div className="w-full max-w-md mx-auto">
                <Card className="shadow-lg">
                    {/* Header */}
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10">
                            <KeyRound className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Reset Password
                        </CardTitle>
                        <CardDescription>
                            Enter your email address and we&apos;ll send you instructions to reset your password.
                        </CardDescription>
                    </CardHeader>

                    {/* Form Section */}
                    <CardContent className="space-y-6">
                        <Suspense fallback={
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner />
                            </div>
                        }>
                            <ResetPasswordForm />
                        </Suspense>

                        {/* Separator */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="flex-1 h-11"
                                >
                                    <Link href="/sign-in">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Sign In
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    asChild
                                    className="flex-1 h-11"
                                >
                                    <Link href="/sign-up">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Create Account
                                    </Link>
                                </Button>
                            </div>

                            {/* Alternative text-based links for smaller screens */}
                            <div className="sm:hidden text-center">
                                <p className="text-sm text-muted-foreground">
                                    Remember your password?{" "}
                                    <Link
                                        href="/sign-in"
                                        className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        Having trouble? Contact our{" "}
                        <Link
                            href="/support"
                            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                        >
                            support team
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword