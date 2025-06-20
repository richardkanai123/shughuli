import TaskDetails from '@/components/Dashboard_Components/tasks_components/TaskDetails';
import { getTaskDetails } from '@/lib/actions/tasks/getTaskDetails';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User, FolderOpen } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectSheet from '@/components/Dashboard_Components/ProjectSheet';
import ErrorAlert from '@/components/Public_Components/ErrorAlert';

const TasksPage = async ({ params }: { params: Promise<{ taskid: string }> }) => {
    const { taskid } = await params;

    const { task, message, status } = await getTaskDetails(taskid);

    if (!task || status !== 200) {
        return <ErrorAlert ErrorMessage={message} />
    }

    return (
        <div className='p-4 space-y-6'>
            <TaskDetails task={task} />

            {/* Additional Information Card */}
            <div
                className="max-w-5xl mx-auto"
            >
                <Card className="shadow-lg border-0 bg-card">
                    <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold">
                                Additional Information
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Assignee Information */}
                            {task.assigneeId && (
                                <Card className="bg-muted/30 border-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                                <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Assigned To
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {task.assigneeId}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Project Information */}
                            <Card className="bg-muted/30 border-muted/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                                            <FolderOpen className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Project
                                        </span>
                                    </div>
                                    <Suspense fallback={
                                        <Skeleton className="h-6 w-32" />
                                    }>
                                        <ProjectSheet projectid={task.projectId} />
                                    </Suspense>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TasksPage