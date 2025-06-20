'use client'
import { Task } from '@/lib/generated/prisma'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, MoreHorizontal, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getStatusStyles } from '@/lib/TaskStatusStyle'
import { getPriorityStyles } from '@/lib/TaskPriorityStyle'

interface TaskListItemProps {
    task: Task
    variants?: any
}

export function TaskListItem({ task, variants }: TaskListItemProps) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

    return (
        <motion.div variants={variants} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Card className={cn(
                "hover:shadow-md transition-all duration-200 border-muted/50 hover:border-primary/20",
                isOverdue && "border-destructive/30 bg-destructive/5"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-base mb-2 truncate">
                                        {task.title}
                                    </h3>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs", getStatusStyles(task.status))}
                                        >
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs", getPriorityStyles(task.priority))}
                                        >
                                            {task.priority}
                                        </Badge>
                                        {isOverdue && (
                                            <Badge variant="destructive" className="text-xs">
                                                Overdue
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Description */}
                            {task.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                            )}

                            {/* Progress */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">Progress</span>
                                    <span className="text-xs font-medium">{task.progress || 0}%</span>
                                </div>
                                <Progress value={task.progress || 0} className="h-2" />
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span className={isOverdue ? "text-destructive" : ""}>
                                                {format(new Date(task.dueDate), 'MMM dd')}
                                            </span>
                                        </div>
                                    )}
                                    {task.updatedAt && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                {format(new Date(task.updatedAt), 'MMM dd')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Button variant="ghost" size="sm" asChild className="h-8 px-3">
                                    <Link href={`/dashboard/tasks/${task.id}`}>
                                        <span className="text-xs">View</span>
                                        <ArrowRight className="h-3 w-3 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}