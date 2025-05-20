import CreateNewLink from '@/components/Dashboard_Components/project_components/CreateNewLink'
import ProjectsOverview from '@/components/Dashboard_Components/ProjectsOverview'
import TasksSummary from '@/components/Dashboard_Components/TasksSummary'
import AuthRequired from '@/components/Public_Components/Profile/AuthRequired'
import ProjectsOverviewSkeleton from '@/components/Skeletons/ProjectOverView'
import { GetUserTasks } from '@/lib/actions/tasks/get-tasks'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import QuickStats from '@/components/Dashboard_Components/QuickStats'
import { TaskStatusSummarySkeleton } from '@/components/Skeletons/TasksOverViewSkeletons'
import ProjectsLoadingSkeleton from '@/components/Skeletons/ProjectsLoading'
import ProjectsLister from '@/components/Dashboard_Components/project_components/ProjectsLister'
import { GetUserProjects } from '@/lib/actions/projects/get-projects'
import DashboardTasksList from '@/components/Dashboard_Components/task-components/TasksList'
import Greetings from '@/components/Dashboard_Components/Greetings'

const Dashboard = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    if (!session) {
        return (
            <AuthRequired />
        )
    }

    const tasksData = GetUserTasks(session.userId)
    const userProjects = GetUserProjects(session.userId)

    return (
        <div className="container mx-auto py-4 space-y-6 px-4">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
                <Greetings username={session.username as string} image={session.image as string} />

                <CreateNewLink />
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 px-4">
                    {/* Quick Stats Row */}
                    <QuickStats tasksPromise={tasksData} userProjects={userProjects} />

                    {/* Two-column layout for projects and tasks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Suspense fallback={<ProjectsOverviewSkeleton />}>
                            <ProjectsOverview userid={session.userId} />
                        </Suspense>

                        <Suspense fallback={<TaskStatusSummarySkeleton />}>
                            <TasksSummary tasksPromise={tasksData} />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="projects">
                    <Suspense fallback={<ProjectsLoadingSkeleton />}>
                        <ProjectsLister projects={userProjects} limit={10} />
                    </Suspense>
                </TabsContent>

                <TabsContent value="tasks">
                    <Suspense fallback={<TaskStatusSummarySkeleton />}>
                        <DashboardTasksList tasks={tasksData} limit={15} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Dashboard