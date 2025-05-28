// make a project private

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const changeVisibility = async (projectId: string, currentPrivacy:boolean) => { 
    
    try {
        if (!projectId) {
            return {
              success: false,
                message: "Project ID is required",
            };
        }

        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return {
               success: false,
                message: "Unauthorized",
            };
        }

        const userId = session.userId

        // Check if the project exists and belongs to the user
        const targetProject = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!targetProject) {
            return {
              success: false,
                message: "Project not found",
            };
        }

        if (targetProject.ownerId !== userId) {
            return {
                success: false,
                message: "You do not have permission to make this project private",
            };
        }

        // Update the project to make it private or public
        if( targetProject.isPublic === currentPrivacy) {
            return {
                success: false,
                message: `Project is already ${currentPrivacy ? "public" : "private"}`,
            };
        }
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                isPublic: currentPrivacy,
                updatedAt: new Date(), // Update the timestamp
            },
        });
        return {
            success: true,
            message: `Project visibility changed to ${currentPrivacy ? "public" : "private"} successfully`,
            project: updatedProject,
        };
       
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
};