import EditProject from '@/components/Dashboard_Components/project_components/EditProject';
import ErrorAlert from '@/components/Public_Components/ErrorAlert';
import { getProjectDetails } from '@/lib/actions/projects/get-ProjectDetails';
import React, { Suspense } from 'react'

const EditProjectPage = async ({
    params,
}: {
    params: Promise<{ projectid: string }>;
}) => {
    const { projectid } = await params;
    if (!projectid) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="text-red-500">Project ID is required.</div>
            </div>
        );
    }

    const projectData = await getProjectDetails(projectid);

    if (projectData.status !== 200) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <ErrorAlert ErrorMessage={projectData.message} />
            </div>
        );
    }

    if (!projectData.project) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <ErrorAlert ErrorMessage="Project not found or you do not have permission to edit it." />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-4 px-2">
            <div className="w-full p-2 flex justify-between align-middle">
                <h1 className="text-sm font-light">
                    Edit Project: <Suspense fallback={<span>Loading...</span>}>{projectData.project.name}</Suspense>
                </h1>
            </div>
            <Suspense fallback={<div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg">Loading...</div>}>
                <EditProject project={projectData.project} />
            </Suspense>
        </div>
    )
}

export default EditProjectPage