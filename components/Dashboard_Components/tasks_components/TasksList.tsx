'use client'
import { Task } from '@/lib/generated/prisma'
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, X, LayoutList, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskListItem } from './TaskListItem'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

interface TasksListProps {
    tasks: Task[]
}

export function TasksList({ tasks }: TasksListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredTasks, setFilteredTasks] = useState(tasks)
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage, setTasksPerPage] = useState(10)

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredTasks(tasks)
            return
        }

        const query = searchQuery.toLowerCase().trim()
        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(query) ||
            task.status.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        )
        setFilteredTasks(filtered)
        setCurrentPage(1) // Reset to first page when filtering
    }, [searchQuery, tasks])

    // Pagination logic
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage)
    const indexOfLastTask = currentPage * tasksPerPage
    const indexOfFirstTask = indexOfLastTask - tasksPerPage
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)

    // Handle page changes
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
        // Scroll to top of list when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 }
        }
    }

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = []

        // Add previous page button
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(
                        "cursor-pointer hover:bg-muted/50 transition-colors",
                        currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                />
            </PaginationItem>
        )

        // Calculate visible page numbers
        const visiblePages = []

        if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                visiblePages.push(i)
            }
        } else {
            // Always show first page
            visiblePages.push(1)

            // Show ellipsis if needed
            if (currentPage > 3) {
                visiblePages.push(-1) // Use -1 as flag for ellipsis
            }

            // Show current page and neighbors
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
                visiblePages.push(i)
            }

            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                visiblePages.push(-2) // Use -2 as flag for ellipsis
            }

            // Always show last page
            visiblePages.push(totalPages)
        }

        // Add page numbers or ellipsis
        visiblePages.forEach(page => {
            if (page < 0) {
                items.push(
                    <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                )
            } else {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
        })

        // Add next page button
        items.push(
            <PaginationItem key="next">
                <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(
                        "cursor-pointer hover:bg-muted/50 transition-colors",
                        currentPage === totalPages && "pointer-events-none opacity-50"
                    )}
                />
            </PaginationItem>
        )

        return items
    }

    const startRow = indexOfFirstTask + 1
    const endRow = Math.min(indexOfLastTask, filteredTasks.length)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Enhanced Header */}
            <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <LayoutList className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Tasks List</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Browse and manage your tasks
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                <Filter className="h-3 w-3 mr-1" />
                                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                            </Badge>
                            {searchQuery && (
                                <Badge variant="secondary" className="text-xs">
                                    Filtered
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* Enhanced Search Bar */}
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks by title, description, or status..."
                                className="pl-10 pr-10 h-10 bg-background border-muted/50 focus:border-primary/50"
                            />
                            {searchQuery && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Content Card */}
            <Card className="shadow-sm border-0 bg-card">
                <CardContent className="p-6">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                {filteredTasks.length === 0 ? (
                                    <span>No tasks found</span>
                                ) : (
                                    <span>
                                        Showing {startRow}-{endRow} of {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                                        {searchQuery && (
                                            <span className="text-primary font-medium ml-1">
                                                matching "{searchQuery}"
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Tasks per page selector */}
                        {filteredTasks.length > 5 && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Show:</span>
                                <Select
                                    value={tasksPerPage.toString()}
                                    onValueChange={(value) => {
                                        setTasksPerPage(Number(value))
                                        setCurrentPage(1)
                                    }}
                                >
                                    <SelectTrigger className="h-8 w-20 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground">per page</span>
                            </div>
                        )}
                    </div>

                    <Separator className="mb-6" />

                    {/* Tasks List */}
                    <AnimatePresence mode="wait">
                        {filteredTasks.length === 0 ? (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="text-center py-12"
                            >
                                <div className="mx-auto w-fit p-4 rounded-full bg-muted/50 mb-4">
                                    <LayoutList className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg mb-2">
                                        {searchQuery ? 'No matching tasks' : 'No tasks found'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery
                                            ? 'Try adjusting your search terms or clear the filter'
                                            : 'Create your first task to get started'}
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`page-${currentPage}-${tasksPerPage}`}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3"
                            >
                                {currentTasks.map((task, index) => (
                                    <motion.div
                                        key={task.id}
                                        variants={itemVariants}
                                        custom={index}
                                    >
                                        <TaskListItem
                                            task={task}
                                            variants={itemVariants}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="mt-8"
                        >
                            <Separator className="mb-6" />

                            <div className="flex items-center justify-between">
                                {/* Pagination Info */}
                                <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                                    <span>
                                        Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                                        <span className="font-medium text-foreground">{totalPages}</span>
                                    </span>
                                </div>

                                {/* Pagination Controls */}
                                <Pagination className="justify-center sm:justify-end">
                                    <PaginationContent>
                                        {renderPaginationItems()}
                                    </PaginationContent>
                                </Pagination>

                                {/* Quick Navigation */}
                                <div className="hidden lg:flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="h-8 px-3"
                                    >
                                        First
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="h-8 px-3"
                                    >
                                        Last
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}