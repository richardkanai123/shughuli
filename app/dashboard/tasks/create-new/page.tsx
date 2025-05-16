import CreateTask from '@/components/Dashboard_Components/tasks_components/Create_Task'
import AuthRequired from '@/components/Public_Components/Profile/AuthRequired'
import { GetUserProjects } from '@/lib/actions/projects/get-projects'
import { auth } from '@/lib/auth'
import { Link, PlusIcon } from 'lucide-react'
import { headers } from 'next/headers'
import React, { Suspense } from 'react'

const CreateNewTaskPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return (
            <AuthRequired />
        )
    }

    const { projects, message, status } = await GetUserProjects(session.userId)

    if (!projects && status === 200 || !projects) {
        return (
            <div className="w-full p-4 rounded-lg shadow-sm mb-4">
                <p>{message}</p>

                <Link href="/dashboard/projects/create-new" className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Create Project
                </Link>
            </div>
        )
    }

    const projectsData = projects.map((project) => {
        return {
            id: project.id,
            name: project.name,
            slug: project.slug,
            dueDate: project.dueDate
        }
    })

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateTask projects={projectsData} />
        </Suspense>
    )
}

export default CreateNewTaskPage