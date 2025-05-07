'use client'

import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const CTABtn = () => {
    const { isPending, data } = useSession()

    if (isPending) return <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
    </Button>

    if (!data && !isPending) {
        return (
            <Button>
                <Link href="/sign-in">
                    Get Started
                </Link>
            </Button>
        )

    }

    if (data) {
        return (
            <Button>
                <Link href="/dashboard">View Dashboard</Link>
            </Button>
        )
    }

}

export default CTABtn