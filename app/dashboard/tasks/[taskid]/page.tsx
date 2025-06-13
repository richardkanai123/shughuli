import TaskDetails from '@/components/Dashboard_Components/tasks_components/TaskDetails';
import { getTaskDetails } from '@/lib/actions/tasks/getTaskDetails';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Flag, Folder, User } from 'lucide-react';
import UserSheet from '@/components/Dashboard_Components/UserSheet';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectSheet from '@/components/Dashboard_Components/ProjectSheet';
const TasksPage = async ({ params }: { params: Promise<{ taskid: string }> }) => {
    const { taskid } = await params;

    const { task, message, status } = await getTaskDetails(taskid);

    if (status === 401) {
        return <div>
            <h1 className='text-2xl font-bold text-red-500'>{message}</h1>
            <p className='text-gray-500'>You are not authorized to view this task.</p>
        </div>
    }

    if (status === 404) {
        return <div>
            <h1 className='text-2xl font-bold text-red-500'>{message}</h1>
            <p className='text-gray-500'>The task you are looking for does not exist.</p>
        </div>
    }
    if (status === 403) {
        return <div>
            <h1 className='text-2xl font-bold text-red-500'>{message}</h1>
            <p className='text-gray-500'>You are not allowed to view this task.</p>
        </div>
    }

    if (!task) {
        return (<div>
            <h1 className='text-2xl font-bold text-red-500'>{message}</h1>
            <p className='text-gray-500'>The task you are looking for does not exist.</p>
        </div>)
    }


    return (
        <div className='p-4'>
            <TaskDetails task={task} />
            {/* You can add more components or details here as needed */}
            {/* Additional Details */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
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
                            <div className="space-y-1">
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
                                <ProjectSheet projectid={task.projectId} />
                            </Suspense>
                        </div>




                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TasksPage