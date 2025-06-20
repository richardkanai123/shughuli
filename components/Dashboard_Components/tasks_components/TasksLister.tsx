'use client'
import React, { use } from 'react'
import { Task } from '@/lib/generated/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TasksTable } from './TasksTable'
import { TasksList } from './TasksList'
import { LayoutList, Table2, AlertCircle, CheckSquare, Filter } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import ErrorAlert from '@/components/Public_Components/ErrorAlert'

interface TasksPromise {
    tasks: Task[] | null
    message: string
    status: number
}

const TasksLister = ({ tasksPromise }: { tasksPromise: Promise<TasksPromise> }) => {
    const { tasks, message, status } = use(tasksPromise)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    }

    // Error state
    if (status !== 200) {
        return (
            <motion.div
                key="error-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <ErrorAlert ErrorMessage={message} />
            </motion.div>
        )
    }

    // Empty state
    if (!tasks || tasks.length === 0) {
        return (
            <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-muted/50 bg-muted/20">
                    <CardContent className="p-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-fit p-4 rounded-full bg-muted/50">
                                <CheckSquare className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">No Tasks Found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Get started by creating your first task or check your filters.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    // Get task statistics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'DONE').length
    const pendingTasks = totalTasks - completedTasks

    return (
        <motion.div
            key="tasks-lister-main"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header with Statistics */}
            <motion.div key="header-section" variants={itemVariants}>
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <CheckSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Tasks Overview</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Manage and track your tasks
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    <Filter className="h-3 w-3 mr-1" />
                                    {totalTasks} Total
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm text-muted-foreground">
                                    {completedTasks} Completed
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-sm text-muted-foreground">
                                    {pendingTasks} Pending
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tabs for Different Views */}
            <motion.div key="tabs-section" variants={itemVariants}>
                <Tabs defaultValue="table" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
                            <TabsTrigger
                                value="table"
                                className={cn(
                                    "flex items-center gap-2 text-xs font-medium",
                                    "data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                )}
                            >
                                <Table2 className="h-3.5 w-3.5" />
                                Table View
                            </TabsTrigger>
                            <TabsTrigger
                                value="list"
                                className={cn(
                                    "flex items-center gap-2 text-xs font-medium",
                                    "data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                )}
                            >
                                <LayoutList className="h-3.5 w-3.5" />
                                List View
                            </TabsTrigger>
                        </TabsList>

                        <Badge variant="secondary" className="text-xs">
                            {totalTasks} task{totalTasks !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    {/* Fixed: Removed AnimatePresence wrapper and added unique keys */}
                    <TabsContent value="table" className="mt-0">
                        <motion.div
                            key="table-view-content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ErrorBoundary
                                key="table-error-boundary"
                                errorComponent={() => (
                                    <Card key="table-error-card" className="border-destructive/50 bg-destructive/5">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 text-destructive">
                                                <AlertCircle className="h-5 w-5" />
                                                <div>
                                                    <h3 className="font-semibold mb-1">Table View Error</h3>
                                                    <p className="text-sm">Something went wrong loading the table view</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            >
                                <Card key="table-content-card" className="shadow-sm border-0 bg-card">
                                    <CardContent className="p-0">
                                        <TasksTable tasks={tasks} />
                                    </CardContent>
                                </Card>
                            </ErrorBoundary>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="list" className="mt-0">
                        <motion.div
                            key="list-view-content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ErrorBoundary
                                key="list-error-boundary"
                                errorComponent={() => (
                                    <Card key="list-error-card" className="border-destructive/50 bg-destructive/5">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 text-destructive">
                                                <AlertCircle className="h-5 w-5" />
                                                <div>
                                                    <h3 className="font-semibold mb-1">List View Error</h3>
                                                    <p className="text-sm">Something went wrong loading the list view</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            >
                                <TasksList key="tasks-list-component" tasks={tasks} />
                            </ErrorBoundary>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    )
}

export default TasksLister