'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { signIn, useSession } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'

const GoogleAuthBtn = () => {
    const { data, isPending, error, refetch } = useSession()


    if (data) {
        return (
            <Button className="w-full h-12 bg-white/90  hover:bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 text-gray-700 font-semibold border border-gray-200 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer">
                <Link href="/dashboard">Continue {data.username}</Link>
            </Button>
        )
    }

    if (error) {
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>

            <Button size='sm' variant='secondary' className='mx-auto' onClick={() => refetch()}>Try again</Button>
        </Alert>
    }

    return (
        <Button
            onClick={async () => await signIn.social({
                provider: "google",
                callbackURL: "/dashboard",

            })}
            type="button"
            className="w-full h-12 bg-white/90  hover:bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 text-gray-700 font-semibold border border-gray-200 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer">
            {
                isPending ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <FcGoogle className="w-6 h-6" />

                )
            }

            Continue with Google
        </Button>
    )
}

export default GoogleAuthBtn