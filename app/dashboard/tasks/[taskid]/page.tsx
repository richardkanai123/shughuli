import TaskDetails from '@/components/Dashboard_Components/tasks_components/TaskDetails';
import { getTaskDetails } from '@/lib/actions/tasks/getTaskDetails';
import React from 'react'

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
        </div>
    )
}

export default TasksPage