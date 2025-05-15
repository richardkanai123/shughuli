import ProjectsOverview from '@/components/Dashboard_Components/ProjectsOverview'
import RecentNotifications from '@/components/Dashboard_Components/RecentNotifications'
import SignInBtn from '@/components/Public_Components/Buttons/sign-inBtn'
import SignOutBtn from '@/components/Public_Components/Buttons/SignOutBtn'
import AuthRequired from '@/components/Public_Components/Profile/AuthRequired'
import ProjectsOverviewSkeleton from '@/components/Skeletons/ProjectOverView'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Suspense } from 'react'

const Dashboard = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    if (!session) {
        return (
            <AuthRequired />
        )
    }


    return (
        <div className="flex flex-col gap-4 p-2">
            <p>Dashboard</p>

            <RecentNotifications userId={session.userId} />
            <Suspense fallback={<ProjectsOverviewSkeleton />}>
                <ProjectsOverview userid={session.userId} />
            </Suspense>
            {session ? <SignOutBtn /> : <SignInBtn />}
        </div>
    )
}

export default Dashboard