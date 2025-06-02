'use client'
import { Suspense, use, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Import sub-components instead of including everything in one file
import TaskStatusSummary from './tasks_components/TaskStatusSummary';
import TaskUrgentAlert from './tasks_components/TaskUrgentAlert';
import TasksDueThisWeek from './tasks_components/TasksDueThisWeek';
import TaskStatusChart from './tasks_components/TaskStatusChart';
import TasksDueToday from './tasks_components/TasksDueToday'; // New component

// Types moved to a separate file for reusability
import { TasksData, TaskStats, calculateTaskStats } from './tasks_components/taskUtils';
import { AlertTriangle, Calendar } from 'lucide-react';
import TaskCompletionChart from './tasks_components/CompletionChart';
import {
    ChartSkeleton,
    CompletionProgressSkeleton,
    TasksDueThisWeekSkeleton,
    TasksDueTodaySkeleton, // New skeleton
    TaskStatusSummarySkeleton,
    TaskUrgentAlertSkeleton
} from '../Skeletons/TasksOverViewSkeletons';

const TasksSummary = ({ tasksPromise }: { tasksPromise: Promise<TasksData> }) => {
    const tasksData = use(tasksPromise);
    const { tasks, message, status } = tasksData;

    // Calculate task statistics - this is still memoized but the logic is moved to a utility function
    const taskStats: TaskStats | null = useMemo(() => {
        if (!tasks || tasks.length === 0) return null;
        return calculateTaskStats(tasks);
    }, [tasks]);

    // Handle error state
    if (status !== 200) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Tasks Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
                        <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                        {message}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Handle empty state
    if (!tasks || tasks.length === 0 || !taskStats) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Tasks Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">No tasks found</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Create some tasks to see your progress
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <Card className="w-full">
                <CardHeader className="pb-2">
                    <CardTitle>Tasks Overview</CardTitle>
                    <CardDescription>
                        {taskStats.totalTasks} total tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    {/* Tasks Due Today with Suspense - NEW SECTION */}
                    <Suspense fallback={<TasksDueTodaySkeleton />}>
                        <TasksDueToday tasks={tasks} />
                    </Suspense>

                    {/* Task Status Summary with Suspense */}
                    <Suspense fallback={<TaskStatusSummarySkeleton />}>
                        <TaskStatusSummary
                            statusCounts={taskStats.statusCounts}
                            overdueTasks={taskStats.overdueTasks}
                        />
                    </Suspense>

                    {/* Completion progress */}
                    <Suspense fallback={<CompletionProgressSkeleton />}>
                        <div className="mb-6">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-muted-foreground">Completion Rate</span>
                                <span className="text-sm font-medium">{taskStats.completionRate}%</span>
                            </div>
                            <Progress value={taskStats.completionRate} className="h-2" />
                        </div>
                    </Suspense>

                    {/* Urgent Task Alert with Suspense */}
                    <Suspense fallback={<TaskUrgentAlertSkeleton />}>
                        <TaskUrgentAlert tasks={tasks} />
                    </Suspense>



                    {/* Due This Week with Suspense */}
                    <Suspense fallback={<TasksDueThisWeekSkeleton />}>
                        <TasksDueThisWeek dueThisWeek={taskStats.dueThisWeek} />
                    </Suspense>

                    {/* Charts with Suspense */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <Suspense fallback={<ChartSkeleton title="Task Status Distribution" />}>
                            <TaskStatusChart data={taskStats.statusChartData} />
                        </Suspense>

                        <Suspense fallback={<ChartSkeleton title="Completion Analysis" />}>
                            <TaskCompletionChart data={taskStats.completionChartData} />
                        </Suspense>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TasksSummary;