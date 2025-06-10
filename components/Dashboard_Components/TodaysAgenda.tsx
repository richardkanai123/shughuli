import { Calendar, CheckCircle2, ArrowRight, X } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/generated/prisma";
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import AgendaTaskItem from "./TodayAgendaTaskItem";
import { task } from "better-auth/react";

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
    // Filter tasks due today with corrected date comparison
    const todaysTasks = tasks
        ?.filter((task) => {
            // Return false if no due date exists
            if (!task.dueDate) return false;

            // Return false if task is already done
            if (task.status === "DONE") return false;

            // Get task due date and today's date
            const taskDate = new Date(task.dueDate);
            const todayDate = new Date();

            // Compare only the date portions (year, month, day)
            return (
                taskDate.getFullYear() === todayDate.getFullYear() &&
                taskDate.getMonth() === todayDate.getMonth() &&
                taskDate.getDate() === todayDate.getDate()
            );
        })
        .slice(0, 3);

    const noOfTasks = todaysTasks?.length || 0;
    const hasError = status !== 200;
    const hasContent = !hasError && noOfTasks > 0;

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
                <Suspense
                    fallback={
                        <div className="text-center py-6 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                            <p>Loading today's tasks...</p>
                            <p className="text-sm mt-1">Please wait a moment.</p>
                        </div>
                    }>
                    {hasError ? (
                        <div className="text-center py-6 text-red-500">
                            <X className="h-12 w-12 mx-auto mb-3" />
                            <p>{message}</p>
                            <p className="text-sm mt-1">Please try again later.</p>
                        </div>
                    ) : noOfTasks > 0 ? (
                        <AnimatePresence>
                            <ul className="space-y-4">
                                {todaysTasks?.map((task) => (
                                    <AgendaTaskItem
                                        key={task.id}
                                        task={task}
                                    />
                                ))}
                            </ul>
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                            <p>No tasks scheduled for today</p>
                            <p className="text-sm mt-1">Enjoy your day!</p>
                        </div>
                    )}
                </Suspense>
            </CardContent>

            {hasContent && (
                <CardFooter className="pt-0">
                    <Link
                        href="/dashboard/tasks"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                        View all tasks
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
};

export default TodaysAgenda;
