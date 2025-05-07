'use client'
import { sendVerificationEmail, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useState } from "react"
import Link from "next/link"

const VerifyEmailBtn = ({ email }: { email: string }) => {
    const { data, isPending } = useSession()
    const [loading, setLoading] = useState(false)

    const VerifyEmail = async () => {
        await sendVerificationEmail({
            email: email,
            callbackURL: "/dashboard", // The redirect URL after verification
        }, {
            onRequest: () => {
                setLoading(true)
            },
            onSuccess: () => {
                setLoading(false)
                toast.success("Verification email sent successfully")
            },
            onError: (ctx) => {
                setLoading(false)
                toast.error(ctx.error.message || "Failed to send verification email")
            }
        });
    }

    if (isPending) return <Button disabled>Verifying...</Button>

    if (!data && !isPending) return (
        <Button>
            <Link href="/sign-in">
                Sign In Now
            </Link>
        </Button>
    )

    return (
        <Button onClick={async () => VerifyEmail()} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            {loading ? "Sending..." : "Verify Email"}
        </Button>
    )
}

export default VerifyEmailBtn