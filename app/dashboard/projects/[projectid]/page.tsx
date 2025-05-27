import { getProjectDetails } from '@/lib/actions/projects/get-ProjectDetails'
import { ScrollArea } from "@/components/ui/scroll-area"
import ProjectDetails from '@/components/Dashboard_Components/project_components/ProjectDetails'
import { GetProjectTasks } from '@/lib/actions/projects/get-project-tasks'
import DashboardTasksList from '@/components/Dashboard_Components/task-components/TasksList'
import { Suspense } from 'react'
import { TasksListSkeleton } from '@/components/Skeletons/TasksListSkeleton'


const ProjectPage = async ({ params }: { params: Promise<{ projectid: string }> }) => {

    const { projectid } = await params
    const data = await getProjectDetails(projectid)

    if (data.status !== 200) {
        return (
            <div>{data.message}</div>
        )
    }

    if (!data.project) {
        return (
            <div>Project not found</div>
        )
    }
    const { project } = data

    const tasks = GetProjectTasks(data.project.id)

    return (
        <div className="min-h-[calc(100vh-4rem)] max-h-fit">
            <div className="max-w-6xl mx-auto space-y-8">
                <ProjectDetails project={project} />
            </div>

            {/* list of tasks related to this project */}
            <Suspense fallback={<TasksListSkeleton />}>
                <DashboardTasksList tasks={tasks} />
            </Suspense>
        </div>
    )
}

export default ProjectPage