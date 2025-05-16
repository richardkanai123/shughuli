'use client'
import { Project } from "@/lib/generated/prisma";
import Link from "next/link";
import { use } from "react";
const ProjectsLister = ({ projects }: {
    projects: Promise<{
        projects: Project[] | null;
        message: string;
        status: number;
    }>
}) => {

    const { message, status, projects: data } = use(projects)

    if (status !== 200) {
        return (
            <div>{message}</div>
        )
    }

    if (!data && status === 200) {
        return (
            <div>{message}</div>
        )
    }

    return (
        //    list of projects

        <div className="w-full">
            {
                data?.map((project) => (
                    <Link href={`/dashboard/projects/${project.slug}`} key={project.id} className="w-full p-4 rounded-lg shadow-sm mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-foreground mr-4"></div>
                                <div>
                                    <h2 className="text-lg font-semibold">{project.name}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default ProjectsLister