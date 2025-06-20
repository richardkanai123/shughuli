import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/lib/generated/prisma";
import {
    BarChart3,
    CheckCircle2,
    TrendingUp,
    Clock,
    Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TaskStatusCard from "./TaskStatusCard";

interface TaskProgressProps {
    tasksPromise: Promise<{
        tasks: Task[] | null;
        message: string;
        status: number;
    }>;
}

const TaskProgress = async ({ tasksPromise }: TaskProgressProps) => {
    const { message, tasks } = await tasksPromise;

    // Handle case when tasks are null or empty
    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Card className="shadow-sm border-0 bg-card">
                    <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">
                                    Task Progress
                                </CardTitle>
                                <CardDescription>
                                    {message || "No tasks available"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-fit p-4 rounded-full bg-muted/50">
                                <Target className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-medium text-lg mb-2">No Tasks Yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    Create your first task to start tracking progress
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "DONE").length;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    const overdueTasks = tasks.filter(
        (task) =>
            task.status !== "DONE" && new Date(task.dueDate as Date) < new Date()
    );
    const overduePercentage = Math.round(
        (tasks.filter(
            (task) =>
                task.status !== "DONE" && new Date(task.dueDate as Date) < new Date()
        ).length /
            totalTasks) *
        100
    );

    // Group tasks by status - only compute once
    const tasksByStatus = tasks.reduce(
        (acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    // Define the status items to display
    const statusItems = [
        {
            key: "TODO",
            label: "ToDo",
            Data: tasks.filter((task) => task.status === "TODO").length,
        },
        {
            key: "IN_PROGRESS",
            label: "In Progress",
            Data: tasks.filter((task) => task.status === "IN_PROGRESS").length,
        },
        {
            key: "DONE",
            label: "Done",
            Data: tasks.filter((task) => task.status === "DONE").length,
        },
        {
            key: "BACKLOG",
            label: "Backlog",
            Data: tasks.filter((task) => task.status === "BACKLOG").length,
        },
        {
            key: "REVIEW",
            label: "Review",
            Data: tasks.filter((task) => task.status === "REVIEW").length,
        },
        {
            key: "ARCHIVED",
            label: "Archived",
            Data: tasks.filter((task) => task.status === "ARCHIVED").length,
        },
        {
            key: "CANCELLED",
            label: "Cancelled",
            Data: tasks.filter((task) => task.status === "CANCELLED").length,
        },
    ];

    return (
        <div>
            <Card className="shadow-sm border-0 bg-card">
                {/* Enhanced Header */}
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">
                                    Task Progress
                                </CardTitle>
                                <CardDescription>
                                    Track your productivity and completion rates
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {totalTasks} Total
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Progress Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Overall Progress Card */}
                            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">
                                            Completion Rate
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                {completedTasks} of {totalTasks} completed
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                {completionPercentage}%
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={completionPercentage}
                                            className="h-2 bg-green-100 dark:bg-green-900/30"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Overdue Tasks Card */}
                            <Card
                                className={cn(
                                    "border-muted/50",
                                    overduePercentage > 0 &&
                                    "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                )}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div
                                            className={cn(
                                                "p-1.5 rounded-md",
                                                overduePercentage > 0
                                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                                    : "bg-muted/50"
                                            )}>
                                            <Clock
                                                className={cn(
                                                    "h-3.5 w-3.5",
                                                    overduePercentage > 0
                                                        ? "text-amber-600 dark:text-amber-400"
                                                        : "text-muted-foreground"
                                                )}
                                            />
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs font-medium uppercase tracking-wider",
                                                overduePercentage > 0
                                                    ? "text-amber-700 dark:text-amber-300"
                                                    : "text-muted-foreground"
                                            )}>
                                            Overdue Tasks
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    overduePercentage > 0
                                                        ? "text-amber-800 dark:text-amber-200"
                                                        : "text-muted-foreground"
                                                )}>
                                                {overdueTasks.length} overdue task
                                                {overdueTasks.length !== 1 ? "s" : ""}
                                            </span>
                                            <Badge
                                                variant={
                                                    overduePercentage > 0 ? "outline" : "secondary"
                                                }
                                                className={cn(
                                                    "text-xs",
                                                    overduePercentage > 0 &&
                                                    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                                )}>
                                                {overduePercentage}%
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={overduePercentage}
                                            className={cn(
                                                "h-2",
                                                overduePercentage > 0
                                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                                    : "bg-muted/50"
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator />

                        {/* Status Breakdown */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Status Breakdown</h3>
                                <Badge
                                    variant="secondary"
                                    className="text-xs">
                                    {Object.keys(tasksByStatus).length} status
                                    {Object.keys(tasksByStatus).length !== 1 ? "es" : ""}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {statusItems.map((statusItem, index) => (
                                    <div
                                        key={index + statusItem.key}
                                        className="flex items-center justify-center">
                                        <TaskStatusCard
                                            label={statusItem.label}
                                            count={statusItem.Data}
                                            status={statusItem.key as Task["status"]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TaskProgress;
