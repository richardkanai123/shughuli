'use client'
import { Task } from '@/lib/generated/prisma'
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
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

interface TasksListProps {
    tasks: Task[]
}

export function TasksList({ tasks }: TasksListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredTasks, setFilteredTasks] = useState(tasks)
    const [currentPage, setCurrentPage] = useState(1)
    const tasksPerPage = 10
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredTasks(tasks)
            return
        }

        const query = searchQuery.toLowerCase().trim()
        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(query) ||
            task.status.toLowerCase().includes(query)
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
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
    }

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = []

        // Add previous page button
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        )

        return items
    }

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-8 h-8 text-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2"
                    >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </div>

            {/* Task Count with Page Info */}
            <div className="text-xs text-muted-foreground px-1 flex justify-between">
                <span>
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    {searchQuery && ` matching "${searchQuery}"`}
                </span>
                {totalPages > 1 && (
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                )}
            </div>

            {/* Tasks List */}
            <AnimatePresence mode="wait">
                {filteredTasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-center py-4 text-muted-foreground"
                    >
                        No tasks found
                    </motion.div>
                ) : (
                    <motion.div
                        key={`page-${currentPage}`}
                        className="space-y-4 overflow-hidden"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {currentTasks.map((task) => (
                            <TaskListItem
                                key={task.id}
                                task={task}
                                variants={item}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="pt-2">
                    <PaginationContent>
                        {renderPaginationItems()}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}