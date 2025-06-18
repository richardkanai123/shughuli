"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";
import { createActivity } from "../activity/create-activity";

export const DeleteTask = async (
	taskid: string
): Promise<{
	success: boolean;
	message: string;
}> => {
	try {
		// Validate input
		if (!taskid || taskid.trim() === "") {
			return {
				success: false,
				message: "Task ID is required",
			};
		}

		// Authenticate user
		const session = await Authenticate();
		const userId = session.userId;

		// First check if task exists and get details for later use
		const targetTask = await prisma.task.findUnique({
			where: { id: taskid },
			include: {
				project: {
					select: {
						id: true,
						ownerId: true,
					},
				},
			},
		});

		if (!targetTask) {
			return {
				success: false,
				message: "Task not found",
			};
		}

		// Verify user has permission (creator, assignee, or project owner)
		const isCreator = targetTask.creatorId === userId;

		const isProjectOwner = targetTask.project?.ownerId === userId;

		if (!isCreator && !isProjectOwner) {
			return {
				success: false,
				message: "Unauthorized - you don't have permission to delete this task",
			};
		}

		// Use transaction for atomicity
		try {
			const result = await prisma.$transaction(async (tx) => {
				// Delete the task
				await tx.task.delete({
					where: { id: taskid },
				});

				// Create activity record with correct parameters
				const activityType = "TASK_DELETED";
				const activityLink = "/dashboard/tasks";
				const activityContent = `Task "${targetTask.title}" deleted`;

				const activityResult = await createActivity(
					activityType,
					activityLink,
					activityContent,
					"",
					targetTask.projectId
				);

				return activityResult;
			});

			// Handle activity creation failure
			if (!result.success) {
				console.warn(
					"Failed to create activity record for task deletion:",
					result.message
				);
			}

			return {
				success: true,
				message: "Task deleted successfully",
			};
		} catch (txError) {
			throw txError;
		}
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "An error occurred while deleting the task",
		};
	}
};
