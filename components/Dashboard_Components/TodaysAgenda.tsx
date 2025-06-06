import { format } from "date-fns";
import { Calendar, CheckCircle2, ClockIcon, ArrowRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/lib/generated/prisma";

interface TodaysAgendaProps {
    date: string;
    tasksPromise: Promise<{
        tasks: Task[] | null;
        message: string;
        status: number;
    }>;
}

const TodaysAgenda = async ({ date, tasksPromise }: TodaysAgendaProps) => {
    const { tasks, message, status } = await tasksPromise;

    // Get today's tasks (due today or scheduled for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // handle case when tasks are null or empty
    if (!tasks || tasks.length === 0) {
        return (
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                            Today's Agenda
                        </CardTitle>
                        <Badge
                            variant="outline"
                            className="font-normal">
                            <Calendar className="h-3 w-3 mr-1" />
                            {date}
                        </Badge>
                    </div>
                    <CardDescription>Your scheduled tasks for today</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p>No tasks scheduled for today</p>
                    <p className="text-sm mt-1">Enjoy your day!</p>
                </CardContent>
            </Card>
        );
    }

    const todaysTasks = tasks
        .filter((task) => {
            const taskDate = task.dueDate ? new Date(task.dueDate) : null;
            if (!taskDate) return false;

            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime() && task.status !== "DONE";
        })
        .slice(0, 3); // Take only top 3

    return (
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        Today's Agenda
                    </CardTitle>
                    <Badge
                        variant="outline"
                        className="font-normal">
                        <Calendar className="h-3 w-3 mr-1" />
                        {date}
                    </Badge>
                </div>
                <CardDescription>Your scheduled tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
                {todaysTasks.length > 0 ? (
                    <ul className="space-y-4">
                        {todaysTasks.map((task) => (
                            <li
                                key={task.id}
                                className="flex items-start space-x-3 group animate-in fade-in-50">
                                <div className="mt-1 relative">
                                    <Checkbox
                                        disabled
                                        id={`task-${task.id}`}
                                        className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                                        defaultChecked={task.status === "DONE"}
                                    />
                                    <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-green-500/20 group-hover:scale-150 transition-all duration-300" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label
                                        htmlFor={`task-${task.id}`}
                                        className="font-medium leading-none group-hover:text-green-600 transition-colors">
                                        {task.title}
                                    </label>
                                    {task.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {task.description}
                                        </p>
                                    )}
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        {task.dueDate && format(new Date(task.dueDate), "h:mm a")}
                                        {task.priority && (
                                            <Badge
                                                variant="outline"
                                                className={`ml-2 ${task.priority === "HIGH"
                                                        ? "text-red-500 border-red-200"
                                                        : task.priority === "MEDIUM"
                                                            ? "text-amber-500 border-amber-200"
                                                            : "text-blue-500 border-blue-200"
                                                    }`}>
                                                {task.priority.toLowerCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                        <p>No tasks scheduled for today</p>
                        <p className="text-sm mt-1">Enjoy your day!</p>
                    </div>
                )}
            </CardContent>
            {todaysTasks.length > 0 && (
                <CardFooter className="pt-0">
                    <a
                        href="/dashboard/tasks"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                        View all tasks
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                </CardFooter>
            )}
        </Card>
    );
};

export default TodaysAgenda;
