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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QuickStats from '@/components/Dashboard_Components/QuickStats'
import { TaskStatusSummarySkeleton } from '@/components/Skeletons/TasksOverViewSkeletons'
import ProjectsLoadingSkeleton from '@/components/Skeletons/ProjectsLoading'
import ProjectsLister from '@/components/Dashboard_Components/project_components/ProjectsLister'
import { GetUserProjects } from '@/lib/actions/projects/get-projects'
import DashboardTasksList from '@/components/Dashboard_Components/task-components/TasksList'

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
        <div className="container mx-auto py-4 space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={session.image || undefined} alt={session.username} />
                        <AvatarFallback>{session.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-semibold">{session.username}'s Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <CreateNewLink />
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Quick Stats Row */}
                    <QuickStats userId={session.userId} />

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