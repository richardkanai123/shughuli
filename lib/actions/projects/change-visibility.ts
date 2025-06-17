"use server";
import { Project } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";

export const changeVisibility = async (
	projectId: string,
	currentPrivacy: boolean
): Promise<{ success: boolean; message: string; project: Project | null }> => {
	try {
		if (!projectId) {
			return {
				success: false,
				message: "Project ID is required",
				project: null,
			};
		}

		const session = await Authenticate();
		const userId = session.userId;

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

		// Create a new activity
		const activityLink = `/dashboard/projects/${updatedProject.slug}`;
		const activityContent = `You have completed ${updatedProject.name}`;

		 await createActivity(
			"PROJECT_UPDATED", 
			activityLink,
			activityContent,
			"",
			updatedProject.id
		);

		
		// Return the updated project
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
