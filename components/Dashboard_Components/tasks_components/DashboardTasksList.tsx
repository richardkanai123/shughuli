'use client'
import { Task, TaskPriority } from '@/lib/generated/prisma'
import { useState, useMemo, useCallback, Suspense, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    CheckCircle,
    MoreHorizontal,
    Clock,
    Filter,
    Search,
    X,
    Plus,
    ArrowUpDown
} from "lucide-react"
import { format, isBefore, isToday, isValid, parseISO } from "date-fns"
import Link from "next/link"
import { use } from "react"
import { getStatusStyles } from '@/lib/TaskStatusStyle'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import ErrorAlert from '@/components/Public_Components/ErrorAlert'

interface TasksListProps {
    tasks: Promise<{ tasks: Task[] | null; message: string; status: number }>
    limit?: number
}

// Helper function to safely parse and validate dates
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

// Priority order mapping for sorting
const PRIORITY_ORDER: Record<TaskPriority, number> = {
    'URGENT': 4,
    'HIGH': 3,
    'MEDIUM': 2,
    'LOW': 1
}

// Memoized skeleton component
const TaskSkeleton = memo(() => (
    <TableRow>
        <TableCell>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[160px]" />
            </div>
        </TableCell>
        <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
        </TableCell>
        <TableCell>
            <div className="flex items-center">
                <Skeleton className="h-3 w-3 mr-2" />
                <Skeleton className="h-4 w-16" />
            </div>
        </TableCell>
        <TableCell>
            <Skeleton className="h-8 w-8" />
        </TableCell>
    </TableRow>
))

TaskSkeleton.displayName = 'TaskSkeleton'

// Memoized task row component
const TaskRow = memo(({ task, projectId }: { task: Task; projectId: string }) => {
    const dueDate = parseDate(task.dueDate)

    const getDueDateStatus = useCallback((date: Date | null) => {
        if (!date) {
            return { className: "text-muted-foreground", label: "No due date" }
        }

        const today = new Date()
        if (isToday(date)) {
            return { className: "text-orange-600 font-medium", label: "Today" }
        } else if (isBefore(date, today)) {
            return { className: "text-destructive font-medium", label: "Overdue" }
        } else {
            return { className: "text-muted-foreground", label: format(date, "MMM dd") }
        }
    }, [])

    const dueDateStatus = getDueDateStatus(dueDate)

    return (
        <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="group hover:bg-muted/50"
        >
            <TableCell>
                <div className="space-y-1">
                    <div className="font-medium text-sm line-clamp-1">{task.title}</div>
                    {task.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                            {task.description.slice(0, 20)}...
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    className={cn("text-xs", getStatusStyles(task.status))}
                    variant="outline"
                >
                    {task.status.replace('_', ' ')}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className={cn("text-xs", dueDateStatus.className)}>
                        {dueDateStatus.label}
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/tasks/${task.id}`} className="cursor-pointer">
                                View details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/tasks/${task.id}/edit`} className="cursor-pointer">
                                Edit task
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </motion.tr>
    )
})

TaskRow.displayName = 'TaskRow'

export default function DashboardTasksList({ tasks, limit = 10 }: TasksListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [sortBy, setSortBy] = useState<string>("dueDate")
    const [page, setPage] = useState(1)

    const params = useParams()
    const projectId = params.projectid as string

    const tasksData = use(tasks)

    // Reset page when filters change
    const resetPage = useCallback(() => {
        setPage(1)
    }, [])

    // Memoized filtering and sorting logic
    const filteredAndSortedTasks = useMemo(() => {
        if (!tasksData.tasks) return []

        let filtered = [...tasksData.tasks]

        // Apply search filter using searchQuery directly (no debounce)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(query) ||
                (task.description?.toLowerCase().includes(query)) ||
                task.status.toLowerCase().includes(query)
            )
        }

        // Apply status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(task => task.status === statusFilter)
        }

        // Apply sorting with proper null/undefined handling
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "dueDate": {
                    const dateA = parseDate(a.dueDate)
                    const dateB = parseDate(b.dueDate)

                    if (!dateA && !dateB) return 0
                    if (!dateA) return 1 // Put tasks without due dates at the end
                    if (!dateB) return -1

                    return dateA.getTime() - dateB.getTime()
                }
                case "title":
                    return a.title.localeCompare(b.title)
                case "status":
                    return a.status.localeCompare(b.status)
                case "priority": {
                    const priorityA = PRIORITY_ORDER[a.priority as TaskPriority] || 0
                    const priorityB = PRIORITY_ORDER[b.priority as TaskPriority] || 0
                    return priorityB - priorityA // Descending order (urgent first)
                }
                default:
                    return 0
            }
        })

        return filtered
    }, [tasksData.tasks, searchQuery, statusFilter, sortBy])

    // Pagination calculations
    const pageSize = limit
    const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize)
    const paginatedTasks = useMemo(() => {
        const startIndex = (page - 1) * pageSize
        return filteredAndSortedTasks.slice(startIndex, startIndex + pageSize)
    }, [filteredAndSortedTasks, page, pageSize])

    // Reset page when filters change
    const handleFilterChange = useCallback((filterType: string, value: string) => {
        if (filterType === 'status') {
            setStatusFilter(value)
        } else if (filterType === 'sort') {
            setSortBy(value)
        }
        setPage(1)
    }, [])

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05
            }
        }
    }

    // Error handling
    if (tasksData.status !== 200) {
        return (

            <ErrorAlert ErrorMessage={tasksData.message} />

        )
    }

    // No tasks state
    if (!tasksData.tasks || tasksData.tasks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            Tasks
                        </CardTitle>
                        <CardDescription>Your task management hub</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                        <div className="mx-auto w-fit p-4 rounded-full bg-muted/50 mb-4">
                            <CheckCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">No tasks yet</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Create your first task to get started with project management
                        </p>
                        <Button asChild>
                            <Link href={`/dashboard/tasks/create-new?project=${projectId}`}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create your first task
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    // Filtered empty state
    const hasActiveFilters = searchQuery.trim() || statusFilter !== "ALL"
    if (filteredAndSortedTasks.length === 0 && hasActiveFilters) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            Tasks
                        </CardTitle>
                        <CardDescription>Your task management hub</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                        <div className="mx-auto w-fit p-4 rounded-full bg-muted/50 mb-4">
                            <Filter className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">No tasks match your filters</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Try adjusting your search terms or removing some filters
                        </p>
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("")
                                    setStatusFilter("ALL")
                                    setPage(1)
                                }}
                            >
                                Clear filters
                            </Button>
                            <Button asChild>
                                <Link href={`/dashboard/tasks/create-new?project=${projectId}`}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create new task
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="shadow-sm border-0 bg-card">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-semibold">Tasks</CardTitle>
                                <CardDescription>
                                    Manage and track your project tasks
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {filteredAndSortedTasks.length} of {tasksData.tasks.length}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Enhanced Filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <div className="flex items-center">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <span>Status</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="TODO">📋 To Do</SelectItem>
                                    <SelectItem value="IN_PROGRESS">🚀 In Progress</SelectItem>
                                    <SelectItem value="REVIEW">👀 Review</SelectItem>
                                    <SelectItem value="DONE">✅ Done</SelectItem>
                                    <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={sortBy}
                                onValueChange={(value) => handleFilterChange('sort', value)}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <div className="flex items-center">
                                        <ArrowUpDown className="mr-2 h-4 w-4" />
                                        <span>Sort</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dueDate">Due Date</SelectItem>
                                    <SelectItem value="title">Title</SelectItem>
                                    <SelectItem value="status">Status</SelectItem>
                                    <SelectItem value="priority">Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Enhanced Search */}
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                className="pl-9 pr-9"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                                    onClick={() => handleSearchChange("")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tasks Table */}
                    <div className="rounded-lg border border-muted/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">Task</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Due Date</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Suspense fallback={
                                    <>
                                        {Array.from({ length: Math.min(pageSize, 5) }).map((_, index) => (
                                            <TaskSkeleton key={index} />
                                        ))}
                                    </>
                                }>
                                    <AnimatePresence mode="wait">
                                        {paginatedTasks.map((task) => (
                                            <TaskRow
                                                key={task.id}
                                                task={task}
                                                projectId={projectId}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </Suspense>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Enhanced Pagination */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredAndSortedTasks.length)} of {filteredAndSortedTasks.length} tasks
                        </div>

                        {totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            className={cn(
                                                "cursor-pointer",
                                                page <= 1 && "pointer-events-none opacity-50"
                                            )}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = i + 1
                                        return (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationLink
                                                    onClick={() => setPage(pageNumber)}
                                                    isActive={page === pageNumber}
                                                    className="cursor-pointer"
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                                            className={cn(
                                                "cursor-pointer",
                                                page >= totalPages && "pointer-events-none opacity-50"
                                            )}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>

                    {/* Create Task Button */}
                    <div className="flex justify-center pt-4 border-t">
                        <Button asChild>
                            <Link href={`/dashboard/tasks/create-new?project=${projectId}`}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Task
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}