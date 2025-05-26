import { getProjectDetails } from '@/lib/actions/projects/get-ProjectDetails'
import { ScrollArea } from "@/components/ui/scroll-area"
import ProjectDetails from '@/components/Dashboard_Components/project_components/ProjectDetails'


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

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="container max-w-4xl mx-auto space-y-8">
                <ProjectDetails project={project} />
            </div>
        </ScrollArea>
    )
}

export default ProjectPage