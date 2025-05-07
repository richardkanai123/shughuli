
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Suspense } from "react"
import { getCurrentUserDetails } from "@/lib/actions/getUserDetails"
import { ProfileHeader } from "@/components/Public_Components/Profile/ProfileHeader"
import { ProfileInfo } from "@/components/Public_Components/Profile/ProfileInfo"
import { ProfileStats } from "@/components/Public_Components/Profile/ProfileStats"
import { RecentActivity } from "@/components/Public_Components/Profile/ProfileActivities"
import LoadingSpinner from "@/components/Public_Components/Loaders/LoadSpinner"
import AuthRequired from "@/components/Public_Components/Profile/AuthRequired"
import ErrorMessage from "@/components/Public_Components/Profile/ProfileError"
import ActionButtons from "@/components/Public_Components/Profile/ProfileActions"
import MemberSince from "@/components/Public_Components/Profile/Membership"
export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return <AuthRequired />
    }

    const { user, error } = await getCurrentUserDetails(session.userId)

    if (error && !user) {
        return <ErrorMessage message={error} />
    }

    if (!user) {
        return <ErrorMessage message="User not found" />
    }

    return (
        <div className="w-full h-full flex-1 mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
                <Suspense fallback={<LoadingSpinner />}>
                    <ProfileHeader user={user} username={session.username as string} />
                </Suspense>

                <div className="relative px-6 pb-6">
                    <div className="pt-20">
                        <Suspense fallback={<LoadingSpinner />}>
                            <ProfileInfo user={user} username={session.username as string} />
                        </Suspense>

                        <Suspense fallback={<LoadingSpinner />}>
                            <ProfileStats role={session.role as string} />
                        </Suspense>

                        <Suspense fallback={<LoadingSpinner />}>
                            <MemberSince createdAt={session.createdAt} />
                        </Suspense>

                        <Suspense fallback={<LoadingSpinner />}>
                            <ActionButtons user={user} />
                        </Suspense>
                    </div>
                </div>
            </div>

            <RecentActivity />
        </div>
    )
}
