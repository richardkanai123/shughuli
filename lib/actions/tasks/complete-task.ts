"use server";
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

		// Get task with more complete data
		const targetTask = await prisma.task.findUnique({
			where: { id: taskId },
			include: {
				project: {
					select: {
						id: true,
						name: true,
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

		// Verify the user is the creator or assignee of the task
		const isCreator = targetTask.creatorId === userId;
		const isAssignee = targetTask.assigneeId === userId;

		if (!isCreator && !isAssignee) {
			return {
				success: false,
				message: "Unauthorized - you can only complete your own tasks",
			};
		}

		// Check if task is already completed
		if (targetTask.status === "DONE") {
			return {
				success: true,
				message: "Task is already marked as complete",
			};
		}

		// Store the project owner ID for notifications
		const projectOwnerId = targetTask.project.ownerId;
		const projectId = targetTask.projectId;
		const taskTitle = targetTask.title;

		// Use a transaction for atomicity
		const result = await prisma.$transaction(async (tx) => {
			// Update the task status to completed
			const updatedTask = await tx.task.update({
				where: { id: taskId },
				data: {
					status: "DONE",
					progress: 100,
					completedAt: new Date(),
					updatedAt: new Date(),
				},
			});

			// Recalculate the average progress of all tasks in the project
			const aggregateResult = await tx.task.aggregate({
				where: {
					projectId: projectId,
				},
				_avg: {
					progress: true,
				},
				_count: true,
			});

			const newProjectProgress = Math.round(aggregateResult._avg.progress || 0);
			const totalTasks = aggregateResult._count;

			// Count completed tasks
			const completedTasksCount = await tx.task.count({
				where: {
					projectId: projectId,
					status: "DONE",
				},
			});

			// Update project progress
			const updatedProject = await tx.project.update({
				where: { id: projectId },
				data: {
					progress: newProjectProgress,
					updatedAt: new Date(),
				},
			});

			// Create a link to the task for activity and notification
			const taskLink = `/dashboard/tasks/${taskId}`;
			const projectLink = `/dashboard/projects/${projectId}`;

			// Create activity message with more context
			const activityMessage = `Task "${taskTitle}" marked as complete.`;

			// Create a new activity log for the task completion
			const activity = await createActivity(
				"TASK_UPDATED", // More specific activity type
				taskLink,
				activityMessage,
				taskId,
				''
			);

			// Create project activity showing progress
			const projectActivityMessage = `Project progress updated to ${newProjectProgress}% (${completedTasksCount}/${totalTasks} tasks complete)`;
			const projectActivity = await createActivity(
				"PROJECT_UPDATED",
				projectLink,
				projectActivityMessage,
				targetTask.id,
				projectId
			);

			// Create notification for the user who completed the task
			const completerNotification = await createNotification(
				"TASK_COMPLETED",
				activityMessage,
				userId,
				taskLink
			);

			// Create notification for project owner (if different from completer)
			let ownerNotification = { success: true };
			if (projectOwnerId && projectOwnerId !== userId) {
				ownerNotification = await createNotification(
					"TASK_COMPLETED",
					`Task "${taskTitle}" in project "${updatedProject.name}" was completed by ${
						isAssignee ? "assignee" : "creator"
					}.`,
					projectOwnerId,
					taskLink
				);
			}

			// Create notification for task creator (if different from completer and owner)
			let creatorNotification = { success: true };
			if (
				targetTask.creatorId &&
				!isCreator &&
				targetTask.creatorId !== projectOwnerId
			) {
				creatorNotification = await createNotification(
					"TASK_COMPLETED",
					`Task "${taskTitle}" that you created was marked as complete.`,
					targetTask.creatorId,
					taskLink
				);
			}

			return {
				updatedTask,
				updatedProject,
				activity,
				projectActivity,
				completerNotification,
				ownerNotification,
				creatorNotification,
				newProjectProgress,
				completedTasksCount,
				totalTasks,
			};
		});

		// Check for activity/notification creation failures
		const activityFailures = [];
		if (!result.activity.success) {
			activityFailures.push("task activity");
			console.warn("Failed to create task completion activity");
		}

		if (!result.projectActivity.success) {
			activityFailures.push("project activity");
			console.warn("Failed to create project update activity");
		}

		if (!result.completerNotification.success) {
			activityFailures.push("completer notification");
			console.warn("Failed to create notification for task completer");
		}

		if (!result.ownerNotification.success) {
			activityFailures.push("owner notification");
			console.warn("Failed to create notification for project owner");
		}

		if (!result.creatorNotification.success) {
			activityFailures.push("creator notification");
			console.warn("Failed to create notification for task creator");
		}

		// Enhanced success message with project progress
		const baseMessage = "Task completed successfully";
		const progressInfo = `Project progress is now ${result.newProjectProgress}% (${result.completedTasksCount}/${result.totalTasks} tasks complete)`;

		let message = `${baseMessage}. ${progressInfo}`;

		if (activityFailures.length > 0) {
			message += `. Note: Failed to create ${activityFailures.join(", ")}.`;
		}

		return {
			success: true,
			message: message,
		};
	} catch (error) {
		console.error("Error completing task:", error);
		return {
			success: false,
			message:
				error instanceof Error
					? `Error completing task: ${error.message}`
					: "Unknown error occurred while completing task",
		};
	}
};
