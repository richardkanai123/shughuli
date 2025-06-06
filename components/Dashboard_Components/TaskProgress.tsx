import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/lib/generated/prisma";
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
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
                    <CardDescription>{message || "No tasks available"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-muted-foreground">
                    <p>Create tasks to track your progress</p>
                </CardContent>
            </Card>
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
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
                <CardDescription>Your overall task completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                            Overall Progress ({completedTasks}/{totalTasks})
                        </div>
                        <div className="text-sm font-medium">{completionPercentage}%</div>
                    </div>
                    <Progress
                        value={completionPercentage}
                        className="h-2"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                            Overdue Tasks ({overdueTasks.length})
                        </div>
                        <div className="text-sm font-medium">{overduePercentage}%</div>
                    </div>
                    <Progress
                        value={overduePercentage}
                        className="h-2"
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-3">
                    {statusItems.map((statusItem) => (
                        <TaskStatusCard
                            key={statusItem.key}
                            label={statusItem.label}
                            count={statusItem.Data}
                            status={statusItem.key as Task["status"]}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskProgress;
