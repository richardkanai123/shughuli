'use client";'
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Project, Task } from "@/lib/generated/prisma";
import { Clock, CheckCircle, BarChart, Calendar } from "lucide-react";
import { Suspense, use } from "react";


interface tasksPromise {
    tasks: Task[] | null;
    message: string;
    status: number;
}

interface projectsPromise {
    projects: Project[] | null;
    message: string;
    status: number;
}

export default function QuickStats({ tasksPromise, userProjects }: { tasksPromise: Promise<tasksPromise>, userProjects: Promise<projectsPromise> }) {
    const { tasks } = use(tasksPromise)
    const { projects } = use(userProjects)

    const stats = {
        activeProjects: projects?.filter((project) => project.status !== "COMPLETED").length || 0,
        tasksCompleted: tasks?.filter((task) => task.status === "DONE").length || 0,
        tasksOverdue: tasks?.filter((task) => task.dueDate && new Date(task.dueDate as Date) < new Date() && task.status !== "DONE").length || 0,
        tasksDueToday: tasks?.filter((task) => {
            const dueDate = new Date(task.dueDate as Date);
            const today = new Date();
            return (
                dueDate.getDate() === today.getDate() &&
                dueDate.getMonth() === today.getMonth() &&
                dueDate.getFullYear() === today.getFullYear()
            );
        }).length || 0,
    };
    return (
        <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-8 w-10" />
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        }>
            <div className="flex flex-col md:flex-row flex-wrap align-middle justify-center items-center gap-4">
                <Card className='shrink-0 w-full md:min-w-[200px] max-w-[350px]'>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Active Projects</p>
                                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                            </div>
                            <BarChart className="h-8 w-8 text-blue-500/20 dark:text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className='shrink-0 w-full md:min-w-[200px] max-w-[350px]'>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Completed Tasks</p>
                                <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500/20 dark:text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className='shrink-0 w-full md:min-w-[200px] max-w-[350px]'>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Overdue Tasks</p>
                                <p className="text-2xl font-bold">{stats.tasksOverdue}</p>
                            </div>
                            <Clock className="h-8 w-8 text-red-500/20 dark:text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className='shrink-0 w-full md:min-w-[200px] max-w-[350px]'>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Due Today</p>
                                <p className="text-2xl font-bold">{stats.tasksDueToday}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-orange-500/20 dark:text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Suspense>
    );
}