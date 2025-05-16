import { auth } from "@/lib/auth";
import {  Project } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
export const GetUserProjects = async (userId: string): Promise<{
    projects: Project[] | null;
    message: string;
    status: number;
}> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
    
        if (!session || !userId) return { projects: null, message: "Unauthorized", status: 401 };
        
       if(session.userId !== userId) return { projects: null, message: "Unauthorized", status: 401 };
    
        const projects = await prisma.project.findMany({
            where: {
                ownerId: userId,
            },
        });
    
        if (!projects) return { projects: null, message: "Projects not found", status: 404 };
    
        if(projects.length===0) return { projects: null, message: "You have no projects", status: 200 };
        return {
            projects,
            message: "Projects fetched successfully",
            status: 200,
        }; 
    } catch (error) {
        if (error instanceof Error) {
            return { projects: null, message: error.message, status: 500 };
        }
        return { projects: null, message: "Internal Server Error", status: 500 };
        
    }
};