// completes a project by setting its status to 'completed' and all tasks to 'completed' as well
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const completeProject = async (projectId: string) => {
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

        const userId = session.userId;

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
                message: "You do not have permission to complete this project",
            };
        }

        // Update the project status to 'completed'
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                status: 'COMPLETED',
                progress: 100, // Set progress to 100% for completed project
                updatedAt: new Date(), // Update the timestamp
            },
        });

        // Update all tasks related to this project to 'completed'
        await prisma.task.updateMany({
            where: { projectId },
            data: { status: 'DONE', progress: 100, updatedAt: new Date() }, // Set progress to 100% for completed tasks
        });

        return {
            success: true,
            message: `Project '${updatedProject.name}' has been completed successfully`,
        };
    } catch (error) {
        console.error("Error completing project:", error);
        return {
            success: false,
            message: "An error occurred while completing the project",
        };
    }
 }