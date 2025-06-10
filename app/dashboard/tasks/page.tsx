import TaskProgress from '@/components/Dashboard_Components/TaskProgress'
import CreateNewTaskLink from '@/components/Dashboard_Components/tasks_components/Create_TaskLink'
import TasksLister from '@/components/Dashboard_Components/tasks_components/TasksLister'
import AuthRequired from '@/components/Public_Components/Profile/AuthRequired'
import TaskProgressSkeleton from '@/components/Skeletons/TaskProgressSkeleton'
import { TasksListSkeleton } from '@/components/Skeletons/TasksListSkeleton'
import { GetUserTasks } from '@/lib/actions/tasks/get-tasks'
import { auth } from '@/lib/auth'

import { headers } from 'next/headers'
import { Suspense } from 'react'

const TasksPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return (
            <AuthRequired />
        )
    }

    const tasksData = GetUserTasks(session.userId)

    return (
        <div className="w-full p-2">
            <div className="w-full p-2 flex justify-between align-middle">
                <h1 className="text-sm font-light">
                    {session.username}'s  Tasks
                </h1>


                <CreateNewTaskLink project={undefined} />
            </div>

            <div className="w-full p-2 space-y-4">


                <Suspense fallback={<TaskProgressSkeleton />}>
                    <TaskProgress tasksPromise={tasksData} />
                </Suspense>

                <Suspense fallback={<TasksListSkeleton />}>
                    <TasksLister tasksPromise={tasksData} />
                </Suspense>
            </div>
        </div>

    )
}

export default TasksPage