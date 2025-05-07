'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditProfileButton } from "../Buttons/EditProfileBtn"
import SignOutBtn from "../Buttons/SignOutBtn"
import { UserDetails } from "@/lib/CustomTypes"
import { Session } from "better-auth"

export default function ActionButtons({ user }: { user: UserDetails }) {
    return (
        <div className="mt-6 w-full flex flex-wrap gap-4 align-middle items justify-between p-4 rounded-lg">
            <Link className="w-fit" href="/dashboard">
                <Button size='lg' className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    View Dashboard
                </Button>
            </Link>
            <EditProfileButton session={{
                username: user.username as string,
                user: {
                    name: user.name as string,
                    email: user.email as string,
                    id: user.id as string,
                }
            }} />


            <SignOutBtn />
        </div>
    )
}