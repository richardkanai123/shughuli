
'use server'
import prisma from "@/lib/prisma";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";

export const completeProject = async (projectId: string) => {
    if (!projectId) {
        return {
            success: false,
            message: "Project ID is required",
        };
    }

    try {

        const session = await Authenticate()

        const userId = session.userId;

        // Use prisma transaction to ensure data consistency
        return await prisma.$transaction(async (tx) => {
            // Check if the project exists and belongs to the user
            const targetProject = await tx.project.findUnique({
                where: { id: projectId },
                include: { tasks: true }
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

            // Optional: Check if all required tasks are complete
            const incompleteRequiredTasks = targetProject.tasks.filter(
                task => task.progress < 100 && task.status !== 'DONE'
            );
            if (incompleteRequiredTasks.length > 0) {
                return {
                    success: false,
                    message: "There are incomplete required tasks. Complete them before completing the project.",
                };
            }

            // Update the project status to 'completed'
            const updatedProject = await tx.project.update({
                where: { id: projectId },
                data: {
                    status: 'COMPLETED',
                    progress: 100,
                    updatedAt: new Date(),
                    endDate: new Date()
                },
            });

            // Update all tasks related to this project to 'completed'
            await tx.task.updateMany({
                where: { projectId },
                data: { 
                    status: 'DONE', 
                    progress: 100, 
                    updatedAt: new Date() 
                },
            });

            // Create a new activity
            const link = `/dashboard/projects/${updatedProject.slug}`;
            const content = `You have completed ${updatedProject.name}`;

            const activityResult = await createActivity(
                'PROJECT_UPDATED', 
                link, 
                content, 
                '', 
                updatedProject.id
            );

            if (!activityResult.success) {
                console.warn("Failed to create activity record for project completion:", activityResult.message);
            }

            return {
                success: true,
                message: `Project '${updatedProject.name}' has been completed successfully`,
            };
        });
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
        return {
            success: false,
            message: "An error occurred while completing the project",
        };
    }
};