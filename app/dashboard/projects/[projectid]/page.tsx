import { getProjectDetails } from "@/lib/actions/projects/get-ProjectDetails";
import ProjectDetails from "@/components/Dashboard_Components/project_components/ProjectDetails";
import { GetProjectTasks } from "@/lib/actions/projects/get-project-tasks";
import DashboardTasksList from "@/components/Dashboard_Components/tasks_components/DashboardTasksList";
import { Suspense } from "react";
import { TasksListSkeleton } from "@/components/Skeletons/TasksListSkeleton";
import { FileQuestion } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import FetchErrorComponent from "@/components/Public_Components/FetchErrorComponent";
import { getProjectAttachments } from "@/lib/actions/projects/project_attachment";
import ProjectAttachments from "@/components/Dashboard_Components/project_components/project-parts/ProjectAttachments";

const ProjectPage = async ({
    params,
}: {
    params: Promise<{ projectid: string }>;
}) => {
    const { projectid } = await params;
    const { message, project, status } = await getProjectDetails(projectid);

    if (status !== 200) {
        return <FetchErrorComponent message={message} />;
    }

    // Error state: Project not found
    if (!project) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-2">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <FileQuestion className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </div>
                        <CardTitle className="text-center">Project Not Found</CardTitle>
                        <CardDescription className="text-center">
                            We couldn't find the project you're looking for.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 rounded-md p-4 mb-4">
                            <p className="text-sm text-center">
                                The project with ID{" "}
                                <span className="font-mono text-xs bg-muted p-1 rounded">
                                    {projectid}
                                </span>{" "}
                                either doesn't exist or you don't have permission to view it.
                            </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-2">What you can do:</p>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                                <li>Check if the project URL is correct</li>
                                <li>Return to your projects list</li>
                                <li>Create a new project</li>
                                <li>
                                    Contact your administrator if you believe this is an error
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const tasks = GetProjectTasks(project.id);
    const attachments = getProjectAttachments(project.id);

    return (
        <div className="min-h-[calc(100vh-4rem)] max-h-fit">
            <div className="max-w-6xl mx-auto space-y-8">
                <ProjectDetails project={project} />
            </div>
            {/* Attachments section */}
            <div className="max-w-6xl mx-auto mt-8 mb-4">
                <Suspense fallback={<div className="text-center">Loading attachments...</div>}>
                    <ProjectAttachments attachments={attachments} projectid={project.id} />
                </Suspense>
            </div>

            {/* list of tasks related to this project */}
            <Suspense fallback={<TasksListSkeleton />}>
                <DashboardTasksList tasks={tasks} />
            </Suspense>
        </div>
    );
};

export default ProjectPage;
