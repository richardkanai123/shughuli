"use server";
import prisma from "@/lib/prisma";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";

export const DeleteProject = async (id: string) => {
	try {
		if (!id) {
			return {
				success: false,
				message: "Project ID is required",
			};
		}

		const session = await Authenticate();

		const targetProject = await prisma.project.delete({
			where: {
				id: id,
			},
			select: {
				name: true,
				ownerId: true,
				slug: true,
			},
		});

		if (targetProject.ownerId !== session.userId) {
			return {
				success: false,
				message: "You do not have permission to delete this project",
			};
		}

		if (!targetProject) {
			return {
				success: false,
				message: "Project not found",
			};
		}

		// Create a new activity
		const link = `/dashboard/projects`;
		const content = `You have deleted ${targetProject.name}`;

		const activityResult = await createActivity(
			"PROJECT_DELETED",
			link,
			content,
			"",
			id
		);
		// Check if the activity was created successfully
		// Log a warning if the activity creation failed
		if (!activityResult.success) {
			console.warn(
				"Failed to create activity record for project deletion:",
				activityResult.message
			);
		}

		return {
			success: true,
			message: `${targetProject.name} deleted successfully`,
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
			message: "Internal Server Error",
		};
	}
};
