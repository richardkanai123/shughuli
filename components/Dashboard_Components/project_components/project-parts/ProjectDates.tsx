'use client'
import { Clock, AlertCircle, CheckCircle2, Play, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, isAfter, formatDistanceToNow, differenceInDays, isValid, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { useSession } from "@/lib/auth-client"
import UpdateProjectDueDate from "../UpdateProjectDueDate"
import { ProjectStatus } from "@/lib/generated/prisma"
import ErrorAlert from "@/components/Public_Components/ErrorAlert"

interface ProjectDatesProps {
    startDate?: Date | string | null
    endDate?: Date | string | null
    dueDate?: Date | string | null
    projectId: string
    status: ProjectStatus
    hideAuth?: boolean // Option to skip auth check if parent handles it
}

// Helper function to safely parse dates
const parseDate = (date: Date | string | null): Date | null => {
    if (!date) return null

    try {
        if (date instanceof Date) {
            return isValid(date) ? date : null
        }

        const parsed = typeof date === 'string' ? parseISO(date) : new Date(date)
        return isValid(parsed) ? parsed : null
    } catch {
        return null
    }
}

// Terminal project statuses that don't require overdue warnings
const TERMINAL_STATUSES: ProjectStatus[] = ['COMPLETED', 'ARCHIVED', 'CANCELLED']

const ProjectDates = ({
    startDate,
    endDate,
    dueDate,
    projectId,
    status,
    hideAuth = false
}: ProjectDatesProps) => {
    // ✅ ALWAYS call hooks in the same order - moved to top
    const { data, error, isPending } = useSession()

    // ✅ All memoized calculations at the top level
    const dates = useMemo(() => {
        return {
            start: parseDate(startDate as Date | string),
            end: parseDate(endDate as Date | string),
            due: parseDate(dueDate as Date | string)
        }
    }, [startDate, endDate, dueDate])

    const dateInfo = useMemo(() => {
        const now = new Date()
        const { start, end, due } = dates

        const isProjectTerminal = TERMINAL_STATUSES.includes(status)
        const isOverdue = due ? isAfter(now, due) && !isProjectTerminal : false

        let daysRemaining: number | null = null
        if (due && !isProjectTerminal) {
            daysRemaining = differenceInDays(due, now)
        }

        return {
            isOverdue,
            daysRemaining,
            isProjectTerminal
        }
    }, [dates, status])

    const dueDateBadge = useMemo(() => {
        const { isOverdue, daysRemaining } = dateInfo

        if (isOverdue) {
            return {
                variant: 'destructive' as const,
                text: 'Overdue',
                className: ''
            }
        }

        if (daysRemaining !== null) {
            if (daysRemaining <= 0) {
                return {
                    variant: 'destructive' as const,
                    text: 'Due Today',
                    className: ''
                }
            }

            if (daysRemaining === 1) {
                return {
                    variant: 'outline' as const,
                    text: 'Due Tomorrow',
                    className: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }
            }

            if (daysRemaining <= 3) {
                return {
                    variant: 'outline' as const,
                    text: `${daysRemaining} days left`,
                    className: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }
            }

            if (daysRemaining <= 7) {
                return {
                    variant: 'secondary' as const,
                    text: 'This Week',
                    className: ''
                }
            }
        }

        return null
    }, [dateInfo])

    const hasDateErrors = useMemo(() => {
        const errors = []
        if (startDate && !dates.start) errors.push('start date')
        if (endDate && !dates.end) errors.push('end date')
        if (dueDate && !dates.due) errors.push('due date')
        return errors
    }, [startDate, endDate, dueDate, dates])

    // ✅ Conditional returns AFTER all hooks have been called
    if (!hideAuth) {
        if (error) {
            return <ErrorAlert ErrorMessage={error.message} />
        }

        if (!data) {
            return <ErrorAlert ErrorMessage="You must be logged in to view project dates." />
        }
    }

    if (hasDateErrors.length > 0) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Invalid {hasDateErrors.join(', ')} format. Please contact support.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Enhanced Header */}
            <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Project Timeline</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Track project milestones and deadlines
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Timeline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date Card */}
                <Card className="bg-muted/30 border-muted/50 hover:border-primary/20 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                                <Play className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Start Date
                            </span>
                        </div>

                        {dates.start ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    {format(dates.start, 'MMM dd, yyyy')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Started {formatDistanceToNow(dates.start, { addSuffix: true })}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Not started yet</p>
                                <p className="text-xs text-muted-foreground">
                                    Project planning phase
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* End Date Card */}
                <Card className="bg-muted/30 border-muted/50 hover:border-primary/20 transition-colors">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                End Date
                            </span>
                        </div>

                        {dates.end ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    {format(dates.end, 'MMM dd, yyyy')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {isAfter(new Date(), dates.end)
                                        ? `Completed ${formatDistanceToNow(dates.end, { addSuffix: true })}`
                                        : `Completion ${formatDistanceToNow(dates.end, { addSuffix: true })}`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">In progress</p>
                                <p className="text-xs text-muted-foreground">
                                    {dateInfo.isProjectTerminal ? 'Project completed' : 'Active development'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Due Date Card */}
            <Card className={cn(
                "border-muted/50 hover:border-primary/20 transition-colors",
                dateInfo.isOverdue && "border-destructive/50 bg-destructive/5",
                dateInfo.daysRemaining !== null &&
                dateInfo.daysRemaining <= 3 &&
                !dateInfo.isOverdue &&
                "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "p-1.5 rounded-md",
                                dateInfo.isOverdue
                                    ? "bg-destructive/20"
                                    : dateInfo.daysRemaining !== null && dateInfo.daysRemaining <= 3
                                        ? "bg-amber-100 dark:bg-amber-900/30"
                                        : "bg-primary/10"
                            )}>
                                <Clock className={cn(
                                    "h-3.5 w-3.5",
                                    dateInfo.isOverdue
                                        ? "text-destructive"
                                        : dateInfo.daysRemaining !== null && dateInfo.daysRemaining <= 3
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
                        ) : (
                            <UpdateProjectDueDate
                                projectId={projectId}
                                dueDate={dates.due as Date}
                                startDate={dates.start as Date}
                            />
                        )}
                    </div>

                    {dates.due ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className={cn(
                                    "text-sm font-medium",
                                    dateInfo.isOverdue && "text-destructive"
                                )}>
                                    {format(dates.due, 'MMM dd, yyyy')}
                                </p>

                                {/* Status Badge */}
                                {dueDateBadge && (
                                    <Badge
                                        variant={dueDateBadge.variant}
                                        className={cn("text-xs", dueDateBadge.className)}
                                    >
                                        {dueDateBadge.text}
                                    </Badge>
                                )}
                            </div>

                            {/* Status Text */}
                            {dateInfo.isOverdue ? (
                                <div className="flex items-center gap-2 text-xs text-destructive">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span>
                                        Overdue by {Math.abs(dateInfo.daysRemaining!)} day{Math.abs(dateInfo.daysRemaining!) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            ) : dateInfo.daysRemaining !== null ? (
                                <p className="text-xs text-muted-foreground">
                                    {dateInfo.daysRemaining === 0
                                        ? "Due today"
                                        : dateInfo.daysRemaining === 1
                                            ? "Due tomorrow"
                                            : dateInfo.daysRemaining > 0
                                                ? `${dateInfo.daysRemaining} days remaining`
                                                : "Past due"}
                                </p>
                            ) : null}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">No due date set</p>
                            <p className="text-xs text-muted-foreground">
                                Click "Edit" to set a deadline for better project tracking
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default ProjectDates