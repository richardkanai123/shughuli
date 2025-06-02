'use server'
import { auth } from "@/lib/auth";
import { Project } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const changeVisibility = async (projectId: string, currentPrivacy:boolean): Promise<{ success: boolean; message: string; project: Project | null }> => {

    try {
        if (!projectId) {
            return {
              success: false,
                message: "Project ID is required",
                project: null,
            };
        }

        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return {
               success: false,
                message: "Unauthorized",
                project: null,
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
                project: null,
            };
        }

        if (targetProject.ownerId !== userId) {
            return {
                success: false,
                message: "You do not have permission to make this project private",
                project: null,
            };
        }

        // Update the project to make it private or public
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                isPublic: !currentPrivacy,
                updatedAt: new Date(), // Update the timestamp
            },
        });
        return {
            success: true,
            message: `Project visibility changed to ${updatedProject.isPublic ? "public" : "private"}`,
            project: updatedProject,
        };
       
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
                project: null,
            };
        }
        return {
            success: false,
            message: "An unexpected error occurred",
            project: null,
        };
    }
};