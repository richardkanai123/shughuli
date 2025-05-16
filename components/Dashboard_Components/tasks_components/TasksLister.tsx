import { Task } from '@/lib/generated/prisma';
import React from 'react'

interface TasksPromise {
    tasks: Task[] | null;
    message: string;
    status: number;
}

const TasksLister = ({ tasksPromise }: { tasksPromise: Promise<TasksPromise> }) => {


    return (
        <div>TasksLister</div>
    )
}

export default TasksLister