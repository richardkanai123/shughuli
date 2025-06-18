'use server'
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";
import { createActivity } from "../activity/create-activity";
import { createNotification } from "../notifications/createNotification";

export const CompleteTask = async (
	taskId: string
): Promise<{
	success: boolean;
	message: string;
}> => {
	try {
		// Validate input
		if (!taskId || taskId.trim() === "") {
			return {
				success: false,
				message: "Task ID is required",
			};
		}

		// Authenticate user
		const session = await Authenticate();
		const userId = session.userId;

		// check if the task exists
		const targetTask = await prisma.task.findUnique({
			where: { id: taskId },
		});
		if (!targetTask) {
			return {
				success: false,
				message: "Task not found",
			};
		}

		// Verify the user is the creator or assignee of the task
		if (targetTask.creatorId !== userId && targetTask.assigneeId !== userId) {
			return {
				success: false,
				message: "Unauthorized - you can only complete your own tasks",
			};
		}
		// Update the task status to completed
		await prisma.task.update({
			where: { id: taskId },
			data: { status: "DONE", progress: 100 },
		});

		const taskLink = `/dashboard/tasks/${targetTask.id}`;

		// create a new activity log for the task completion
		await createActivity(
			"TASK_UPDATED",
			taskLink,
			`Task ${targetTask.title} completed. `,
			taskId,
			targetTask.projectId
		);

		await createNotification(
			"TASK_COMPLETED",
			`Task ${targetTask.title} completed. `,
			userId,
			taskLink
		);

		return {
			success: true,
			message: "Task completed successfully",
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				message: `Failed to complete task: ${error.message}`,
			};
		}

		return {
			success: false,
			message: "Internal Server Error",
		};
	}
};
