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

		// Use a minimal transaction for critical operations only
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

			// Get project progress data in a single optimized query
			const projectStats = await tx.task.aggregate({
				where: {
					projectId: projectId,
				},
				_avg: {
					progress: true,
				},
				_count: {
					_all: true,
					
				},
			});

			const newProjectProgress = Math.round(projectStats._avg.progress || 0);
			const totalTasks = projectStats._count._all;
			const completedTasksCount = projectStats._count._all
				? await tx.task.count({
					where: {
						projectId: projectId,
						status: "DONE",
					},
				})
				: 0;

			// Update project progress
			const updatedProject = await tx.project.update({
				where: { id: projectId },
				data: {
					progress: newProjectProgress,
					updatedAt: new Date(),
				},
			});

			return {
				updatedTask,
				updatedProject,
				newProjectProgress,
				completedTasksCount,
				totalTasks,
			};
		}, {
			timeout: 10000, // 10 second timeout
		});

		// Move all activity and notification creation outside transaction
		const taskLink = `/dashboard/tasks/${taskId}`;
		const projectLink = `/dashboard/projects/${projectId}`;
		const activityMessage = `Task "${taskTitle}" marked as complete.`;

		// Create activities and notifications asynchronously (non-blocking)
		const [
			activity,
			projectActivity,
			completerNotification,
			ownerNotification,
			creatorNotification
		] = await Promise.allSettled([
			createActivity(
				"TASK_UPDATED",
				taskLink,
				activityMessage,
				taskId,
				''
			),
			createActivity(
				"PROJECT_UPDATED",
				projectLink,
				`Project progress updated to ${result.newProjectProgress}% (${result.completedTasksCount}/${result.totalTasks} tasks complete)`,
				targetTask.id,
				projectId
			),
			createNotification(
				"TASK_COMPLETED",
				activityMessage,
				userId,
				taskLink
			),
			// Owner notification (if different from completer)
			projectOwnerId && projectOwnerId !== userId 
				? createNotification(
					"TASK_COMPLETED",
					`Task "${taskTitle}" in project "${result.updatedProject.name}" was completed by ${
						isAssignee ? "assignee" : "creator"
					}.`,
					projectOwnerId,
					taskLink
				)
				: Promise.resolve({ success: true }),
			// Creator notification (if different from completer and owner)
			targetTask.creatorId && !isCreator && targetTask.creatorId !== projectOwnerId
				? createNotification(
					"TASK_COMPLETED",
					`Task "${taskTitle}" that you created was marked as complete.`,
					targetTask.creatorId,
					taskLink
				)
				: Promise.resolve({ success: true })
		]);

		// Convert Promise.allSettled results back to expected format
		const activityResults = {
			activity: activity.status === 'fulfilled' ? activity.value : { success: false },
			projectActivity: projectActivity.status === 'fulfilled' ? projectActivity.value : { success: false },
			completerNotification: completerNotification.status === 'fulfilled' ? completerNotification.value : { success: false },
			ownerNotification: ownerNotification.status === 'fulfilled' ? ownerNotification.value : { success: false },
			creatorNotification: creatorNotification.status === 'fulfilled' ? creatorNotification.value : { success: false },
		};

		// Merge transaction result with activity results
		const finalResult = {
			...result,
			...activityResults,
		};


		if (!finalResult.updatedTask || !finalResult.updatedProject) {
			return {
				success: false,
				message: "Failed to update task or project",
			};
		}
		// Collect any activity failures
		const activityFailures = [];
		if (!finalResult.activity.success) {
			activityFailures.push("task activity");
		}
		if (!finalResult.projectActivity.success) {
			activityFailures.push("project activity");
		}
		if (!finalResult.completerNotification.success) {
			activityFailures.push("completer notification");
		}
		if (!finalResult.ownerNotification.success) {
			activityFailures.push("owner notification");
		}
		if (!finalResult.creatorNotification.success) {
			activityFailures.push("creator notification");
		}
		// If there are no activity failures, we can return a success message
		if (activityFailures.length === 0) {
			return {
				success: true,
				message: "Task completed successfully.",
			};
		
		} else {
			return {
				success: true,
				message: `Task completed, but some activities failed: ${activityFailures.join(", ")}`,
			};
		}


		
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
