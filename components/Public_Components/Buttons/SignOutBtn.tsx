'use client'

import { Button } from "@/components/ui/button"
import { signOut, useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
const SignOutBtn = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const Router = useRouter()
    const session = useSession()

    if (!session) return null

    return (
        <>
            <Button onClick={() => signOut({
                fetchOptions: {
                    onError: (error) => setError(error.error.message),
                    onRequest: () => setLoading(true),
                    onSuccess: () => {
                        setError(null)
                        setLoading(false)
                        Router.replace('/sign-in')
                    }
                }
            })} variant='destructive' size='sm'>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Signing out..." : "Sign out"}
            </Button>
            {error && <p className="text-destructive">{error}</p>}
        </>
    )
}

export default SignOutBtn