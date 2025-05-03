'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { useState } from "react"
const SignInBtn = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    return (
        <>
            <Button onClick={async () => {
                setLoading(true)
                await signIn.email({
                    email: "testmail1@mail.com",
                    password: "Password1",
                    callbackURL: "/dashboard"
                }, {
                    onSuccess: (ctx) => {
                        console.log(ctx)
                        setLoading(false)
                    },
                    onError: (error) => {
                        setError(error.error.message)
                        setLoading(false)
                    }

                })
                setLoading(false)
            }


            } type='submit'>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign in"}
            </Button>

            {
                error && <p className="text-red-500">{error}</p>
            }
        </>
    )
}

export default SignInBtn