import CreateNewLink from "@/components/Dashboard_Components/project_components/CreateNewLink";
import AuthRequired from "@/components/Public_Components/Profile/AuthRequired";
import { GetUserTasks } from "@/lib/actions/tasks/get-tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

import ProjectsLoadingSkeleton from "@/components/Skeletons/ProjectsLoading";
import ProjectsLister from "@/components/Dashboard_Components/project_components/ProjectsLister";
import { GetUserProjects } from "@/lib/actions/projects/get-projects";
import DashboardTasksList from "@/components/Dashboard_Components/tasks_components/DashboardTasksList";
import Greetings from "@/components/Dashboard_Components/Greetings";
import { GetRecentActivities } from "@/lib/actions/activity/getUserActivities";
import { TaskStatusSummarySkeleton } from "@/components/Skeletons/TasksOverViewSkeletons";
import OverviewCardSkeleton from "@/components/Skeletons/OverViewCardSkeleton";
import OverviewCards from "@/components/Dashboard_Components/OverViewCards";
import AgendaSkeleton from "@/components/Skeletons/AgendaSkeleton";
import TodaysAgenda from "@/components/Dashboard_Components/TodaysAgenda";
import TaskProgressSkeleton from "@/components/Skeletons/TaskProgressSkeleton";
import TaskProgress from "@/components/Dashboard_Components/TaskProgress";
import {
    ActiveProjectsSkeleton,
    ActivityFeedSkeleton,
    NotificationsSkeleton,
} from "@/components/Skeletons/Others";
import ActiveProjects from "@/components/Dashboard_Components/ActiveProjects";
import ActivityFeed from "@/components/Dashboard_Components/ActivityFeed";
import NotificationsPanel from "@/components/Dashboard_Components/NotificationsPanel";
const Dashboard = async () => {
    const session = await auth.api.getSession({
        headers: await headers(), // you need to pass the headers object.
    });

    if (!session) {
        return <AuthRequired />;
    }

    const tasksData = GetUserTasks(session.userId);
    const userProjects = GetUserProjects(session.userId);
    const userActivities = GetRecentActivities(session.userId);


    // Get today's date for agenda
    const today = new Date();
    const formattedDate = format(today, "EEEE, MMMM do");

    return (
        <div className="container mx-auto py-4 space-y-6 px-2 md:px-4">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Greetings
                    username={session.username as string}
                    image={session.image as string}
                />
                <div className="self-end">
                    <CreateNewLink />
                </div>
            </div>

            {/* Dashboard Tabs */}
            <Tabs
                defaultValue="overview"
                className="space-y-4">
                <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>

                <TabsContent
                    value="overview"
                    className="space-y-6 animate-in fade-in-50 duration-300">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Suspense fallback={<OverviewCardSkeleton />}>
                            <OverviewCards
                                tasksPromise={tasksData}
                                projectsPromise={userProjects}
                            />
                        </Suspense>
                    </div>

                    {/* Main Content - 2 column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column (2/3 width on large screens) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Today's Agenda */}
                            <Suspense fallback={<AgendaSkeleton />}>
                                <TodaysAgenda
                                    date={formattedDate}
                                    tasksPromise={tasksData}
                                />
                            </Suspense>

                            {/* Task Progress */}
                            <Suspense fallback={<TaskProgressSkeleton />}>
                                <TaskProgress tasksPromise={tasksData} />
                            </Suspense>

                            {/* Active Projects */}
                            <Suspense fallback={<ActiveProjectsSkeleton />}>
                                <ActiveProjects projectsPromise={userProjects} />
                            </Suspense>
                        </div>

                        {/* Right Column (1/3 width on large screens) */}
                        <div className="space-y-6">
                            {/* Recent Activity */}
                            <Suspense fallback={<ActivityFeedSkeleton />}>
                                <ActivityFeed activitiesPromise={userActivities} />
                            </Suspense>

                            {/* Notifications */}
                            <Suspense fallback={<NotificationsSkeleton />}>
                                <NotificationsPanel userId={session.userId} />
                            </Suspense>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent
                    value="projects"
                    className="animate-in fade-in-50 duration-300">
                    <Suspense fallback={<ProjectsLoadingSkeleton />}>
                        <ProjectsLister
                            projects={userProjects}
                            limit={10}
                        />
                    </Suspense>
                </TabsContent>

                <TabsContent
                    value="tasks"
                    className="animate-in fade-in-50 duration-300">
                    <Suspense fallback={<TaskStatusSummarySkeleton />}>
                        <DashboardTasksList
                            tasks={tasksData}
                            limit={15}
                        />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;
