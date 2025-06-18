import EditTask from '@/components/Dashboard_Components/tasks_components/EditTask';
import ErrorAlert from '@/components/Public_Components/ErrorAlert';
import { getProjectDetails } from '@/lib/actions/projects/get-ProjectDetails';
import { getTaskDetails } from '@/lib/actions/tasks/getTaskDetails';
import React, { Suspense } from 'react'

const EditTaskPage = async ({ params }: { params: Promise<{ taskid: string }> }) => {
    const { taskid } = await params;
    const taskPromise = await getTaskDetails(taskid);
    const { task, message, status: promiseStatus } = taskPromise;

    if (promiseStatus !== 200 || !task) {
        return <ErrorAlert ErrorMessage={message} />;
    }

    const project = getProjectDetails(task.projectId);

    return (
        <div className="w-full p-2">
            <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <EditTask task={task} projectPromise={project} />
            </Suspense>
        </div>
    )
}

export default EditTaskPage