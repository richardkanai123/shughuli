'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditProfileButton } from "../Buttons/EditProfileBtn"
import SignOutBtn from "../Buttons/SignOutBtn"

export default function ActionButtons({ session, user }: { session: any, user: any }) {
    return (
        <div className="mt-6 w-full flex flex-wrap gap-4 align-middle items justify-between p-4 rounded-lg">
            <Link className="w-fit" href="/dashboard">
                <Button size='lg' className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    View Dashboard
                </Button>
            </Link>
            <EditProfileButton session={{
                username: session.username as string,
                user: {
                    name: user.name as string,
                    email: user.email as string,
                    id: session.id as string,
                }
            }} />


            <SignOutBtn />
        </div>
    )
}