import CreateNewLink from "@/components/Dashboard_Components/project_components/CreateNewLink";
import ProjectsLister from "@/components/Dashboard_Components/project_components/ProjectsLister";
import AuthRequired from "@/components/Public_Components/Profile/AuthRequired";
import ProjectsLoadingSkeleton from "@/components/Skeletons/ProjectsLoading";
import { GetUserProjects } from "@/lib/actions/projects/get-projects";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

const ProjectsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return (
            <AuthRequired />
        )
    }

    const projectsData = GetUserProjects(session.userId)


    return (
        <div className="w-full p-2">
            <div className="w-full p-2 flex justify-between align-middle">
                <h1 className="text-sm font-light">
                    {session.username}'s  Projects
                </h1>

                <CreateNewLink />
            </div>
            <Suspense fallback={<ProjectsLoadingSkeleton />}>
                <ProjectsLister projects={projectsData} limit={0} />
            </Suspense>
        </div>
    )
}

export default ProjectsPage