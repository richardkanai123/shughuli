"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";
import { createActivity } from "../activity/create-activity";

export const updateTaskProgress = async (
	taskId: string,
	progress: number,
	userId: string
): Promise<{ success: boolean; message: string }> => {
	try {
		// Authenticate user
		const session = await Authenticate();
		const loggedUserid = session.userId;

		// Validate progress value
		if (progress < 0 || progress > 100) {
			return { success: false, message: "Progress must be between 0 and 100" };
		}

		// Validate input
		if (!taskId) {
			return { success: false, message: "Task ID is required" };
		}

		// Get the task and related project in a single query
		const targetTask = await prisma.task.findUnique({
			where: { id: taskId },
			include: {
				project: {
					select: {
						id: true,
						progress: true,
						name: true,
						ownerId: true,
					},
				},
			},
		});

		if (!targetTask) {
			return { success: false, message: "Task not found" };
		}

		// Check user permissions
		const IsRequester = userId === loggedUserid;
		const isOwner = targetTask.creatorId === loggedUserid;
		const isAssignee = targetTask.assigneeId === loggedUserid;
		const isProjectOwner = targetTask.project?.ownerId === loggedUserid;

		if (!IsRequester && !isOwner && !isAssignee && !isProjectOwner) {
			return {
				success: false,
				message: "You are not authorized to update this task",
			};
		}

		// Prevent unnecessary updates if progress hasn't changed
		if (targetTask.progress === progress) {
			return { success: true, message: "Task progress is already at the specified value" };
		}

		// Determine the new task status with more nuanced logic
		let newStatus = targetTask.status;

		if (progress === 100) {
			newStatus = "DONE";
		} else if (progress === 0 && targetTask.status === "DONE") {
			newStatus = "TODO";
		} else if (progress > 0 && progress < 100 && targetTask.status !== "REVIEW") {
			// Only change to IN_PROGRESS if not in REVIEW state
			newStatus = "IN_PROGRESS";
		}

		// Use a transaction for atomicity
		const result = await prisma.$transaction(async (tx) => {
			// 1. Update the task
			const updatedTask = await tx.task.update({
				where: { id: taskId },
				data: {
					progress,
					updatedAt: new Date(),
					status: newStatus,
				},
			});

			// 2. Calculate new project progress with a database aggregation query
			const aggregateResult = await tx.task.aggregate({
				where: {
					projectId: targetTask.project.id,
				},
				_avg: {
					progress: true,
				},
				_count: true,
			});

			const avgProgress = aggregateResult._avg.progress || 0;
			const newProjectProgress = Math.round(avgProgress);

			// 3. Update the project progress if it changed
			const updatedProject = await tx.project.update({
				where: { id: targetTask.project.id },
				data: { progress: newProjectProgress, updatedAt: new Date() },
			});

			// 4. Create activity logs
			const taskActivityLink = `/dashboard/tasks/${taskId}`;
			const taskActivityContent = `Task progress updated to ${progress}%`;

			const projectActivityLink = `/dashboard/projects/${updatedProject.id}`;
			const projectActivityContent = `Project progress updated to ${newProjectProgress}%`;

			// Create task activity
			const taskActivity = await createActivity(
				"TASK_UPDATED",
				taskActivityLink,
				taskActivityContent,
				taskId,
				targetTask.project.id
			);

			// Create project activity only if project progress changed
			let projectActivity = { success: true };
			if (targetTask.project.progress !== newProjectProgress) {
				projectActivity = await createActivity(
					"PROJECT_UPDATED",
					projectActivityLink,
					projectActivityContent,
					updatedProject.id,
					updatedProject.id
				);
			}

			return {
				taskUpdate: updatedTask,
				projectUpdate: updatedProject,
				taskActivity,
				projectActivity,
				oldProgress: targetTask.progress,
				newProgress: progress,
				projectOldProgress: targetTask.project.progress,
				projectNewProgress: newProjectProgress,
			};
		});

		// Check for activity creation failures but don't fail the operation
		if (!result.taskActivity.success || !result.projectActivity.success) {
			console.warn("One or more activity records failed to create during task progress update");
		}

		
		const progressChange = result.newProgress - (result.oldProgress || 0);
		const changeText = progressChange > 0 ? `increased by ${progressChange}%` : `decreased by ${Math.abs(progressChange)}%`;

		return { success: true, message: `Task progress ${changeText} and project progress updated` };

	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? `Failed to update task progress: ${error.message}` : "Unknown error updating task progress",
		};
	}
};
