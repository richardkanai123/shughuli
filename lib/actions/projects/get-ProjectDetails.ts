import { auth } from "@/lib/auth";
import { Project } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";


export const getProjectDetails = async (projectslug: string): Promise<{ project: Project | null; message: string; status: number; }> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { project: null, message: "Unauthorized", status: 401 };
        }

        const project = await prisma.project.findUnique({
            where: {
                slug: projectslug,
            },
        });
        if (!project) {
            return { project: null, message: "Project not found", status: 404 };
        }

        // check if the project belongs to the user or user is part of the project members
        const isProjectOwner = project.ownerId === session.userId;
        if ( !isProjectOwner) {
            return { project: null, message: "Unauthorized", status: 401 };
        }

       

        return { project, message: "Project fetched successfully", status: 200 };
    } catch (error) {
        if (error instanceof Error) {
            return { project: null, message: error.message, status: 500 };
        }
        return { project: null, message: "Internal Server Error", status: 500 };
    }
    
}