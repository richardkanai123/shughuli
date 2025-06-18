'use client'

import { Task } from '@/lib/generated/prisma'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format, formatDistanceToNow, isAfter } from "date-fns"
import { motion } from "framer-motion"
import {
    Calendar,
    Clock,
    FileText,
    Edit2,
    User,
    AlertCircle,
    Edit,
    CheckCircle2,
    BarChart3,
    Tag
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { getStatusStyles } from '@/lib/TaskStatusStyle'
import { getPriorityStyles } from '@/lib/TaskPriorityStyle'
import CompleteTaskBtn from '../buttons/Complete-TaskBtn'
import DeletetaskBtn from '../buttons/delete-taskBtn'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const TaskDetails = ({ task }: { task: Task }) => {
    const { data: session } = useSession()
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
        projectId,
        creatorId,
        assigneeId
    } = task

    // Check if current user is creator or assignee of the task
    const isTaskOwner = useMemo(() =>
        creatorId === session?.userId || assigneeId === session?.userId,
        [creatorId, assigneeId, session]
    )

    // Check if task is overdue
    const isOverdue = useMemo(() => {
        if (!dueDate) return false
        return isAfter(new Date(), new Date(dueDate))
    }, [dueDate])

    // Calculate days remaining
    const daysRemaining = useMemo(() => {
        if (!dueDate) return null
        return Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }, [dueDate])

    // Get formatted dates
    const formattedCreatedAt = createdAt ? format(new Date(createdAt), 'PPP') : 'Unknown'
    const formattedUpdatedAt = updatedAt ? format(new Date(updatedAt), 'PPP') : 'Unknown'
    const formattedDueDate = dueDate ? format(new Date(dueDate), 'PPP') : 'No due date'
    const timeFromCreation = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Unknown'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Task Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className='text-2xl font-bold'>{title}</h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge
                            variant="outline"
                            className={getStatusStyles(status)}
                        >
                            {status}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={getPriorityStyles(priority)}
                        >
                            {priority} Priority
                        </Badge>
                        {isOverdue && (
                            <Badge variant="destructive" className="text-xs font-normal">
                                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                Overdue
                            </Badge>
                        )}
                    </div>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button disabled variant="outline" className="shrink-0">
                                <Clock className="h-4 w-4 mr-2" />
                                Created {timeFromCreation}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Created on {formattedCreatedAt}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Separator />

            {/* Task Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                        Task Progress
                    </h3>
                    <span className="text-sm font-medium">{progress || 0}%</span>
                </div>
                <Progress value={progress || 0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                    {status === "DONE" ? (
                        <span className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                            Completed
                        </span>
                    ) : progress === 100 ? (
                        "100% complete, awaiting status update"
                    ) : progress > 0 ? (
                        `In progress (${progress}% complete)`
                    ) : (
                        "Not started yet"
                    )}
                </p>
            </div>

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Column - Description */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {description ? (
                            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                                {description}
                            </p>
                        ) : (
                            <p className='text-sm text-muted-foreground italic'>
                                No description provided
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Second Column - People */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            People
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Created by:</span>
                            <span className="text-sm text-muted-foreground">
                                {creatorId || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Assigned to:</span>
                            <span className="text-sm text-muted-foreground">
                                {assigneeId || 'Unassigned'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Project:</span>
                            <Link href={`/dashboard/projects/${projectId}`} className="text-sm text-blue-600 hover:underline">
                                {projectId || 'Unknown'}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Task Dates Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Task Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created and Updated Dates - Read Only */}
                    <div className="space-y-1 border rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>Creation & Updates</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Created:</span>
                                <span className="text-sm text-muted-foreground">
                                    {formattedCreatedAt}
                                </span>
                            </div>
                            {updatedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Last Updated:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formattedUpdatedAt}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Due Date - Editable if owner */}
                    <div className="space-y-1 border rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Due Date</span>
                            </div>

                            {isTaskOwner && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                            <Edit className="h-3.5 w-3.5 mr-1" />
                                            <span className="text-xs">
                                                {dueDate ? 'Change' : 'Set'}
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Set Due Date</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Choose when this task should be completed by.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="py-4">
                                            {/* Date picker would go here */}
                                            <div className="border rounded-md p-4 text-center text-muted-foreground">
                                                Date Picker Placeholder
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Save</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>

                        {dueDate ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        isOverdue && "text-red-500"
                                    )}>
                                        {formattedDueDate}
                                    </p>

                                    {isOverdue ? (
                                        <Badge variant="destructive" className="text-xs font-normal">Overdue</Badge>
                                    ) : daysRemaining && daysRemaining <= 3 ? (
                                        <Badge variant="outline" className="text-xs font-normal bg-amber-100 text-amber-800 border-amber-200">
                                            Due soon
                                        </Badge>
                                    ) : null}
                                </div>

                                {isOverdue ? (
                                    <div className="flex items-center gap-1 text-xs text-red-500">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        <span>Overdue by {Math.abs(daysRemaining!)} days</span>
                                    </div>
                                ) : daysRemaining ? (
                                    <p className="text-xs text-muted-foreground">
                                        {daysRemaining} days remaining
                                    </p>
                                ) : null}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">No due date set</p>
                                {isTaskOwner && (
                                    <p className="text-xs text-muted-foreground">
                                        As the task owner, you can set a deadline
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Task Metadata</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-xs">{id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formattedCreatedAt}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Progress:</span>
                        <span>{progress || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span>{status}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center flex-wrap justify-center gap-3 p-2 border-t pt-4">
                <CompleteTaskBtn taskId={id} isComplete={status === "DONE"} />

                <Button variant="secondary" asChild>
                    <Link href={`/dashboard/tasks/${id}/edit`} className="flex items-center gap-2">
                        <Edit2 className="h-4 w-4" />
                        Edit Task
                    </Link>
                </Button>

                <DeletetaskBtn taskId={id} />
            </div>

        </motion.div>
    )
}

export default TaskDetails