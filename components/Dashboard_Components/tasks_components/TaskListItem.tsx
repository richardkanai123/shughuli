'use client'

import { Task } from '@/lib/generated/prisma'
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronRight, Calendar } from "lucide-react"
import { getStatusStyles } from '@/lib/TaskStatusStyle'

interface TaskListItemProps {
    task: Task
    variants?: any
}

export function TaskListItem({ task, variants }: TaskListItemProps) {


    return (
        <motion.div
            variants={variants}
            layout
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
        >
            <Link href={`/dashboard/tasks/${task.id}`} className="block">
                <div className="group hover:bg-accent border border-border/40 rounded-md transition-all duration-200 hover:border-border">
                    <div className="px-3 py-2 flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-medium truncate text-sm">
                                {task.title}
                            </h3>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1 inline" />
                                {formatDistanceToNow(new Date(task.dueDate as Date), { addSuffix: true })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Badge
                                variant="outline"
                                className={`
                                    shrink-0 px-1.5 py-0.5 text-xs font-normal
                                    ${getStatusStyles(task.status)}
                                `}
                            >
                                {task.status}
                            </Badge>
                            <ChevronRight
                                className="h-3 w-3 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}