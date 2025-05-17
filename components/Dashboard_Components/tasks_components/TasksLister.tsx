'use client'
import React, { use } from 'react'
import { Task } from '@/lib/generated/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksTable } from './TasksTable'
import { TasksList } from './TasksList'
import { LayoutList, Table2 } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

interface TasksPromise {
    tasks: Task[] | null
    message: string
    status: number
}

const TasksLister = ({ tasksPromise }: { tasksPromise: Promise<TasksPromise> }) => {
    const { tasks, message, status } = use(tasksPromise)

    if (status !== 200) {
        return (
            <div className="p-4 text-center text-muted-foreground">{message}</div>
        )
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No tasks found
            </div>
        )
    }

    return (
        <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="table" className="flex items-center gap-2">
                    <Table2 className="h-4 w-4" />
                    Table View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                    <LayoutList className="h-4 w-4" />
                    List View
                </TabsTrigger>
            </TabsList>
            <TabsContent value="table">
                <ErrorBoundary errorComponent={
                    () => {
                        return (
                            <div className="w-full p-4 rounded-lg shadow-sm mb-4">
                                <p>Something went wrong</p>
                            </div>
                        )
                    }
                }>

                    <TasksTable tasks={tasks} />
                </ErrorBoundary>
            </TabsContent>
            <TabsContent value="list">
                <TasksList tasks={tasks} />
            </TabsContent>
        </Tabs>
    )
}

export default TasksLister