import SignInForm from '@/components/Public_Components/Forms/sign-in-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const SignIn = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        return (
            <div className="container dark:bg-slate-900 max-w-lg mx-auto mt-16 p-8">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Welcome Back!
                        </h2>
                        <p className="text-muted-foreground">
                            You're already signed in to your account
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <Button asChild variant="default">
                            <Link href="/dashboard" className="space-x-2">
                                <span>Go to Dashboard</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/profile">View Profile</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-md mx-auto mt-8 p-4">
            <SignInForm />
        </div>
    )
}

export default SignIn