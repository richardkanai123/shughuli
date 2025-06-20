'use client'
import { Calendar, Clock, Edit, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, isAfter, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "@/lib/auth-client"
import UpdateProjectDueDate from "../UpdateProjectDueDate"

interface ProjectDatesProps {
    startDate?: Date | string | null
    endDate?: Date | string | null
    dueDate?: Date | string | null
    projectId: string
    ownerId: string
}

const ProjectDates = ({
    startDate,
    endDate,
    dueDate,
    projectId,
    ownerId

}: ProjectDatesProps) => {
    const { data, error, isPending } = useSession()
    const isOwner = useMemo(() => ownerId === data?.userId, [ownerId, data]);

    const isOverdue = useMemo(() => {
        if (!dueDate) return false;
        return isAfter(new Date(), new Date(dueDate));
    }, [dueDate]);

    const daysRemaining = useMemo(() => {
        if (!dueDate) return null;
        return Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    }, [dueDate]);

    if (error) {
        return <p className="text-red-500">Error loading project dates: {error.message}</p>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-6"
        >
            {/* Project Timeline Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Project Timeline</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date - Read Only */}
                    <div className="space-y-1 border rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>Start Date</span>
                        </div>
                        {startDate ? (
                            <div>
                                <p className="text-sm font-medium">{format(new Date(startDate), 'PPP')}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Started {formatDistanceToNow(new Date(startDate), { addSuffix: true })}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Not started yet
                            </p>
                        )}
                    </div>

                    {/* End Date - Read Only */}
                    <div className="space-y-1 border rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>End Date</span>
                        </div>
                        {endDate ? (
                            <div>
                                <p className="text-sm font-medium">{format(new Date(endDate), 'PPP')}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isAfter(new Date(), new Date(endDate))
                                        ? "Completed " + formatDistanceToNow(new Date(endDate), { addSuffix: true })
                                        : "Completion " + formatDistanceToNow(new Date(endDate), { addSuffix: true })}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Project in progress
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Due Date - Editable only for owner */}
            <div className="space-y-1 border rounded-md p-3">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Due Date</span>
                    </div>

                    {
                        isPending &&
                        <Button variant="outline" size="sm" disabled>
                            <span>Loading...</span>
                        </Button>

                    }
                    {(!isPending && isOwner) &&
                        <UpdateProjectDueDate
                            projectId={projectId}
                            dueDate={dueDate as Date}
                            startDate={startDate as Date}
                        />
                    }

                </div>

                {dueDate ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className={cn(
                                "text-sm font-medium",
                                isOverdue && "text-red-500"
                            )}>
                                {format(new Date(dueDate), 'PPP')}
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
                        {isOwner && (
                            <p className="text-xs text-muted-foreground">
                                As the project owner, you can set a deadline
                            </p>
                        )}
                    </div>
                )}
            </div>

            {!isOwner && (
                <p className="text-xs text-muted-foreground">
                    Only the project owner can modify the due date
                </p>
            )}
        </motion.div>
    )
}

export default ProjectDates