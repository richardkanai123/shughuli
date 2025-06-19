"use server";
import { Task, TaskPriority, TaskStatus } from "@/lib/generated/prisma";
import { Authenticate } from "../AuthProtection";
import prisma from "@/lib/prisma";
import { createActivity } from "../activity/create-activity";

// Allowed fields that can be updated
const ALLOWED_UPDATE_FIELDS = [
	"title",
	"description",
	"status",
	"priority",
	"dueDate",
	"progress",
] as const;

// Type for safe updates
type SafeTaskUpdates = Partial<Pick<Task, typeof ALLOWED_UPDATE_FIELDS[number]>>;

export const UpdateTask = async (
	taskId: string,
	updates: Partial<Task>
): Promise<{ message: string; success: boolean }> => {
	try {
		// Authenticate user
		const session = await Authenticate();
		const userid = session.userId;

		// Validate inputs
		if (!taskId) {
			return { message: "Task ID is required", success: false };
		}

		if (!updates || Object.keys(updates).length === 0) {
			return { message: "No updates provided", success: false };
		}

		// Filter updates to only allow specific fields
		const safeUpdates: SafeTaskUpdates = {};
		let updatedFields: string[] = [];

		// Only copy allowed fields to prevent security issues
		for (const field of ALLOWED_UPDATE_FIELDS) {
			if (field in updates && updates[field] !== undefined) {
				safeUpdates[field] = updates[field] as any;
				updatedFields.push(field);
			}
		}

		if (Object.keys(safeUpdates).length === 0) {
			return { message: "No valid update fields provided", success: false };
		}

		// Validate status if it's being updated
		if ("status" in safeUpdates) {
			const status = safeUpdates.status as string;
			const validStatuses: TaskStatus[] = [
				"TODO",
				"IN_PROGRESS",
				"REVIEW",
				"DONE",
				"BACKLOG",
			];

			if (!validStatuses.includes(status as TaskStatus)) {
				return {
					message: `Invalid status: ${status}. Valid values are: ${validStatuses.join(
						", "
					)}`,
					success: false,
				};
			}
		}

		// Validate priority if it's being updated
		if ("priority" in safeUpdates) {
			const priority = safeUpdates.priority as string;
			const validPriorities: TaskPriority[] = [
				"LOW",
				"MEDIUM",
				"HIGH",
				"URGENT",
			];

			if (!validPriorities.includes(priority as TaskPriority)) {
				return {
					message: `Invalid priority: ${priority}. Valid values are: ${validPriorities.join(
						", "
					)}`,
					success: false,
				};
			}
		}

		// Validate progress if it's being updated
		if (
			"progress" in safeUpdates &&
			(safeUpdates.progress! < 0 || safeUpdates.progress! > 100)
		) {
			return {
				message: "Progress must be between 0 and 100",
				success: false,
			};
		}


		// Get the task and related project in a single query
		const targetTask = await prisma.task.findUnique({
			where: {
				id: taskId,
			},
			include: {
				project: {
					select: {
						id: true,
						ownerId: true,
						progress: true,
					},
				},
			},
		});

		if (!targetTask) {
			return { message: "Task not found", success: false };
		}

		// Check permissions
		const isTaskOwner = targetTask.creatorId === userid;
		const isTaskMember = targetTask.assigneeId === userid;
		const isProjectOwner = targetTask.project.ownerId === userid;

		if (!isTaskOwner && !isTaskMember && !isProjectOwner) {
			return {
				message: "Forbidden: You do not have permission to update this task",
				success: false,
			};
		}

		// Use transaction for atomicity
		const result = await prisma.$transaction(async (tx) => {
			// Update the task
			const updatedTask = await tx.task.update({
				where: {
					id: taskId,
				},
				data: safeUpdates,
			});

			// Check if we need to update project progress
			let projectUpdated = false;
			let updatedProject = targetTask.project;

			// If status changed to DONE or progress changed, recalculate project progress
			if (
				("status" in safeUpdates && safeUpdates.status === "DONE") ||
				("progress" in safeUpdates)
			) {
				// Calculate new project progress with a database aggregation query
				const aggregateResult = await tx.task.aggregate({
					where: {
						projectId: targetTask.project.id,
					},
					_avg: {
						progress: true,
					},
				});

				const avgProgress = aggregateResult._avg.progress || 0;
				const newProjectProgress = Math.round(avgProgress);

				// Only update if progress actually changed
				if (newProjectProgress !== targetTask.project.progress) {
					updatedProject = await tx.project.update({
						where: { id: targetTask.project.id },
						data: {
							progress: newProjectProgress,
							updatedAt: new Date(),
						},
					});
					projectUpdated = true;
				}
			}

			// Create detailed activity message
			const fieldsList = updatedFields
				.map((field) => {
					if (field === "status") return `status to ${safeUpdates.status}`;
					if (field === "priority")
						return `priority to ${safeUpdates.priority}`;
					if (field === "progress")
						return `progress to ${safeUpdates.progress}%`;
					if (field === "dueDate")
						return `due date to ${
							safeUpdates.dueDate
								? new Date(safeUpdates.dueDate).toLocaleDateString()
								: "none"
						}`;
					return field;
				})
				.join(", ");

			const taskLink = `/dashboard/tasks/${taskId}`;
			const activityContent = `Task "${updatedTask.title}" updated.`;

			// Create task activity
			const taskActivity = await createActivity(
				"TASK_UPDATED",
				taskLink,
				activityContent,
				updatedTask.id,
				targetTask.projectId
			);

			// Create project activity if project was updated
			let projectActivity = { success: true };
			if (projectUpdated) {
				const projectLink = `/dashboard/projects/${updatedProject.id}`;
				const projectActivityContent = `Project progress updated to ${updatedProject.progress}%`;

				projectActivity = await createActivity(
					"PROJECT_UPDATED",
					projectLink,
					projectActivityContent,
					updatedProject.id,
					updatedProject.id
				);
			}

			return {
				updatedTask,
				updatedProject,
				taskActivity,
				projectActivity,
				projectUpdated,
			};
		});

		// Check for activity creation failures but don't fail the operation
		if (
			!result.taskActivity.success ||
			(result.projectUpdated && !result.projectActivity.success)
		) {
			console.warn(
				"One or more activity records failed to create during task update"
			);
		}

		return {
			message: `Task updated successfully${
				result.projectUpdated ? " and project progress recalculated" : ""
			}`,
			success: true,
		};
	} catch (error) {
		console.error("Error updating task:", error);

		return {
			message:
				error instanceof Error
					? `Failed to update task: ${error.message}`
					: "An unexpected error occurred while updating the task",
			success: false,
		};
	}
};
