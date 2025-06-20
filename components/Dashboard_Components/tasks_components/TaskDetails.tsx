"use client";
import { motion } from "framer-motion";
import { Task } from "@/lib/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    format,
    formatDistanceToNow,
    formatDistanceToNowStrict,
    isAfter,
} from "date-fns";
import {
    Calendar,
    Clock,
    FileText,
    Edit2,
    AlertCircle,
    CheckCircle2,
    BarChart3,
    Tag,
    ListTodo,
    Timer,
    Info,
    Play,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusStyles } from "@/lib/TaskStatusStyle";
import { getPriorityStyles } from "@/lib/TaskPriorityStyle";
import CompleteTaskBtn from "../buttons/Complete-TaskBtn";
import DeletetaskBtn from "../buttons/delete-taskBtn";
import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateTaskProgressBtn from "./UpdateTaskProgressBtn";
import UpdateTaskDueDate from "./UpdateTaskDueDate";

const TaskDetails = ({ task }: { task: Task }) => {
    const { data: session } = useSession();
    const {
        status,
        priority,
        progress,
        dueDate,
        createdAt,
        title,
        description,
        updatedAt,
        id,
        creatorId,
        assigneeId,
    } = task;

    // Check if current user is creator or assignee of the task
    const isTaskOwner = useMemo(
        () => creatorId === session?.userId || assigneeId === session?.userId,
        [creatorId, assigneeId, session]
    );

    // Check if task is overdue
    const isOverdue = useMemo(() => {
        if (!dueDate) return false;
        return (
            status !== "DONE" &&
            status !== "ARCHIVED" &&
            isAfter(new Date(), new Date(dueDate))
        );
    }, [dueDate]);

    // Calculate days remaining
    const daysRemaining = useMemo(() => {
        if (!dueDate) return null;
        return Math.ceil(
            (new Date(dueDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
    }, [dueDate]);

    // Get formatted dates
    const formattedCreatedAt = createdAt
        ? format(new Date(createdAt), "PPP")
        : "Unknown";
    const formattedUpdatedAt = formatDistanceToNowStrict(updatedAt, {
        addSuffix: true,
    });
    const formattedDueDate = dueDate
        ? format(new Date(dueDate), "PPP")
        : "No due date";
    const timeFromCreation = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        : "Unknown";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
        >
            <Card className="shadow-lg border-0 bg-card overflow-hidden">
                {/* Enhanced Header */}
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ListTodo className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                        Task Details
                                    </Badge>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="secondary" className="text-xs">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Created {timeFromCreation}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Created on {formattedCreatedAt}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={getStatusStyles(status)}
                            >
                                {status.replace('_', ' ')}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={getPriorityStyles(priority)}
                            >
                                {priority} Priority
                            </Badge>
                            {isOverdue && (
                                <Badge variant="destructive" className="text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Overdue
                                </Badge>
                            )}
                        </div>
                    </motion.div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-8">
                        {/* Progress Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <BarChart3 className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Progress Overview</h3>
                                <Badge variant="secondary" className="text-xs">
                                    {progress || 0}%
                                </Badge>
                            </div>

                            <Card className="bg-muted/30 border-muted/50">
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Current Progress</span>
                                            <span className="text-sm font-bold">{progress || 0}%</span>
                                        </div>

                                        <Progress
                                            value={progress || 0}
                                            className="h-3"
                                        />

                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                {status === "DONE" ? (
                                                    <span className="flex items-center text-green-600">
                                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                        Task completed
                                                    </span>
                                                ) : progress === 100 ? (
                                                    "Ready for completion"
                                                ) : progress > 0 ? (
                                                    `In progress (${progress}% complete)`
                                                ) : (
                                                    "Not started yet"
                                                )}
                                            </p>

                                            {isTaskOwner && (
                                                <UpdateTaskProgressBtn
                                                    taskId={id}
                                                    currentProgress={progress}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Separator />

                        {/* Description Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Description</h3>
                            </div>

                            <Card className="bg-muted/30 border-muted/50">
                                <CardContent className="p-4">
                                    {description ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {description}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            No description provided for this task.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Separator />

                        {/* Timeline Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Timeline & Dates</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Creation & Updates */}
                                <Card className="bg-muted/30 border-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                                <Play className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Task History
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Created</span>
                                                <span className="text-sm font-medium">
                                                    {format(new Date(createdAt), "MMM dd, yyyy")}
                                                </span>
                                            </div>
                                            {updatedAt && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Last Updated</span>
                                                    <span className="text-sm font-medium">
                                                        {formattedUpdatedAt}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Due Date */}
                                <Card className={cn(
                                    "border-muted/50",
                                    isOverdue && "border-destructive/50 bg-destructive/5",
                                    daysRemaining && daysRemaining <= 3 && !isOverdue && "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
                                )}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "p-1.5 rounded-md",
                                                    isOverdue
                                                        ? "bg-destructive/20"
                                                        : daysRemaining && daysRemaining <= 3
                                                            ? "bg-amber-100 dark:bg-amber-900/30"
                                                            : "bg-primary/10"
                                                )}>
                                                    <Target className={cn(
                                                        "h-3.5 w-3.5",
                                                        isOverdue
                                                            ? "text-destructive"
                                                            : daysRemaining && daysRemaining <= 3
                                                                ? "text-amber-600 dark:text-amber-400"
                                                                : "text-primary"
                                                    )} />
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Due Date
                                                </span>
                                            </div>

                                            {isTaskOwner && (
                                                <UpdateTaskDueDate
                                                    taskid={id}
                                                    dueDate={dueDate as Date}
                                                    createdAt={createdAt as Date}
                                                />
                                            )}
                                        </div>

                                        {dueDate ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className={cn(
                                                        "text-sm font-medium",
                                                        isOverdue && "text-destructive"
                                                    )}>
                                                        {formattedDueDate}
                                                    </p>

                                                    {isOverdue ? (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Overdue
                                                        </Badge>
                                                    ) : daysRemaining && daysRemaining <= 3 ? (
                                                        <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                                                            Due Soon
                                                        </Badge>
                                                    ) : status === "DONE" ? (
                                                        <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300">
                                                            Completed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {daysRemaining ? `${daysRemaining} days` : "No deadline"}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {isOverdue ? (
                                                    <div className="flex items-center gap-2 text-xs text-destructive">
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        <span>Overdue by {Math.abs(daysRemaining!)} day{Math.abs(daysRemaining!) !== 1 ? 's' : ''}</span>
                                                    </div>
                                                ) : daysRemaining !== null ? (
                                                    <p className="text-xs text-muted-foreground">
                                                        {daysRemaining === 0
                                                            ? "Due today"
                                                            : daysRemaining === 1
                                                                ? "Due tomorrow"
                                                                : `${daysRemaining} days remaining`}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">No due date set</p>
                                                {isTaskOwner && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Click "Edit" to set a deadline
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>

                        <Separator />

                        {/* Metadata Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Task Information</h3>
                            </div>

                            <Card className="bg-muted/20 border-muted/30">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">ID</span>
                                            <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                                {id.slice(0, 8)}...
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">Status</span>
                                            <p className="font-medium">{status.replace('_', ' ')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">Priority</span>
                                            <p className="font-medium">{priority}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">Progress</span>
                                            <p className="font-medium">{progress || 0}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            className="flex items-center justify-center gap-3 pt-6 border-t"
                        >
                            <CompleteTaskBtn
                                taskId={id}
                                isComplete={status === "DONE"}
                            />

                            <Button variant="outline" asChild>
                                <Link
                                    href={`/dashboard/tasks/${id}/edit`}
                                    className="flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit Task
                                </Link>
                            </Button>

                            <DeletetaskBtn taskId={id} />
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TaskDetails;