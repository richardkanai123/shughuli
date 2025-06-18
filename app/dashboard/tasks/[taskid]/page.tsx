import TaskDetails from '@/components/Dashboard_Components/tasks_components/TaskDetails';
import { getTaskDetails } from '@/lib/actions/tasks/getTaskDetails';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User } from 'lucide-react';
import UserSheet from '@/components/Dashboard_Components/UserSheet';
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
        <div className='p-4'>
            <TaskDetails task={task} />

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Created By
                            </p>
                            <Suspense fallback={
                                <div className="text-sm text-muted-foreground">
                                    <Skeleton className="h-4 w-24" />
                                </div>

                            }>
                                <UserSheet userid={task.creatorId} />
                            </Suspense>
                        </div>

                        {task.assigneeId && (
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Assigned To
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {task.assigneeId}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Suspense fallback={
                                <div className="text-sm text-muted-foreground">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            }>
                                <div className='flex items-center gap-2'>
                                    <p className="text-sm font-medium flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Project
                                    </p>
                                    <ProjectSheet projectid={task.projectId} />
                                </div>
                            </Suspense>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TasksPage