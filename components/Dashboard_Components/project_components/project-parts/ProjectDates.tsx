'use client'
import { Clock, AlertCircle, CheckCircle2, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format, isAfter, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useMemo } from "react"
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
        return (
            <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">Error loading project dates: {error.message}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Timeline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date Card */}
                <Card className="bg-muted/30 border-muted/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                                <Play className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Start Date
                            </span>
                        </div>

                        {startDate ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    {format(new Date(startDate), 'MMM dd, yyyy')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Started {formatDistanceToNow(new Date(startDate), { addSuffix: true })}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Not started yet
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* End Date Card */}
                <Card className="bg-muted/30 border-muted/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                End Date
                            </span>
                        </div>

                        {endDate ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    {format(new Date(endDate), 'MMM dd, yyyy')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {isAfter(new Date(), new Date(endDate))
                                        ? "Completed " + formatDistanceToNow(new Date(endDate), { addSuffix: true })
                                        : "Completion " + formatDistanceToNow(new Date(endDate), { addSuffix: true })}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                In progress
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Due Date Card */}
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
                                <Clock className={cn(
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

                        {/* Action Button */}
                        {isPending ? (
                            <Skeleton className="h-8 w-16" />
                        ) : isOwner && (
                            <UpdateProjectDueDate
                                projectId={projectId}
                                dueDate={dueDate as Date}
                                startDate={startDate as Date}
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
                                    {format(new Date(dueDate), 'MMM dd, yyyy')}
                                </p>

                                {/* Status Badge */}
                                {isOverdue ? (
                                    <Badge variant="destructive" className="text-xs">
                                        Overdue
                                    </Badge>
                                ) : daysRemaining && daysRemaining <= 3 ? (
                                    <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                                        Due Soon
                                    </Badge>
                                ) : daysRemaining && daysRemaining <= 7 ? (
                                    <Badge variant="secondary" className="text-xs">
                                        This Week
                                    </Badge>
                                ) : null}
                            </div>

                            {/* Status Text */}
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
                            {isOwner && (
                                <p className="text-xs text-muted-foreground">
                                    Click "Edit" to set a deadline
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Permission Note */}
            {!isPending && !isOwner && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    <Card className="bg-muted/20 border-muted/30">
                        <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground text-center">
                                Only the project owner can modify dates
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    )
}

export default ProjectDates