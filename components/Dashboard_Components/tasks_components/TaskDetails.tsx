'use client'

import { Task } from '@/lib/generated/prisma'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format, formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, Clock, FileText, Flag, User, FolderOpen, CheckCircle, Trash2Icon, Edit2 } from "lucide-react"
import { Button } from '@/components/ui/button'
import { getStatusStyles } from '@/lib/TaskStatusStyle'
import { getPriorityStyles } from '@/lib/TaskPriorityStyle'

const TaskDetails = ({ task }: { task: Task }) => {


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Task Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className='text-2xl font-bold'>{task.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant="outline"
                            className={getStatusStyles(task.status)}
                        >
                            {task.status}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={getPriorityStyles(task.priority)}
                        >
                            {task.priority} Priority
                        </Badge>
                    </div>


                </div>
                <div className="flex">
                    {/* shows time since task was created */}
                    <Button disabled variant="outline">
                        <Clock className="h-4 w-4 mr-2" />
                        {
                            task.createdAt ? formatDistanceToNow(new Date(task.createdAt)) + ` now` : 'Unknown'
                        }
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Column */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {task.description ? (
                            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                                {task.description}
                            </p>
                        ) : (
                            <p className='text-sm text-muted-foreground italic'>
                                No description provided
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Second Column */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Created:</span>
                                <span className="text-sm text-muted-foreground">
                                    {task.createdAt ? format(new Date(task.createdAt), 'PPP') : 'Unknown'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Due Date:</span>
                                <span className="text-sm text-muted-foreground">
                                    {format(new Date(task.dueDate as Date), 'PPP')}
                                </span>
                            </div>
                            {task.updatedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Last Updated:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {format(new Date(task.updatedAt), 'PPP')}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center">
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Project
                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            <p className='text-sm text-muted-foreground italic'>
                                {task.projectId}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Additional Details */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Created By
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {task.creatorId}
                            </p>
                        </div>

                        {task.assigneeId && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Assigned To
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {task.assigneeId}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-sm font-medium flex items-center">
                                <Flag className="h-4 w-4 mr-2" />
                                Task ID
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {task.id}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center flex-wrap justify-center-safe gap-2 shrink-0">


                {/* Button to edit task */}
                <Button variant="secondary">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Task
                </Button>

                <Button variant="destructive">
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Delete Task
                </Button>

            </div>
        </motion.div>
    )
}

export default TaskDetails