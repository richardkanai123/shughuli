"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";
import { createActivity } from "../activity/create-activity";
import { isSameDay, isBefore } from "date-fns";
import { createNotification } from "../notifications/createNotification";
import { Task } from "@/lib/generated/prisma";

// Fix type signature to match implementation
export const updateProjectDueDate = async (
	projectId: string,
	dueDate: Date
) => {
	try {
		if (!projectId || projectId.trim() === "") {
			return {
				success: false,
				message: "Project ID is required",
			};
		}

		// Authenticate user
		const session = await Authenticate();
		const userId = session.userId;

		const targetProject = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
			select: {
				id: true,
				name: true,
				ownerId: true,
				dueDate: true,
				startDate: true,
				endDate: true,
				createdAt: true,
				tasks: {
					select: {
						id: true,
						title: true,
						dueDate: true,
						status: true,
						assigneeId: true, // Added for notifications
					},
				},
			},
		});

		if (!targetProject) {
			return {
				success: false,
				message: "Project not found",
			};
		}

		// Check if user is the project owner
		if (targetProject.ownerId !== userId ) {
			return {
				success: false,
				message: "You do not have permission to update this project",
			};
		}

		// Early return if dates are the same (both dates exist and are the same day, or both are null)
		const currentDueDate = targetProject.dueDate
			? new Date(targetProject.dueDate)
			: null;
		const newDueDate = dueDate ? new Date(dueDate) : null;

		if (
			(currentDueDate && newDueDate && isSameDay(currentDueDate, newDueDate)) ||
			(!currentDueDate && !newDueDate)
		) {
			return {
				success: true,
				message: "Due date is already set to the specified date",
			};
		}

		// Validate due date against project start date if both exist
		if (newDueDate && targetProject.startDate) {
			const startDate = new Date(targetProject.startDate);
			if (isBefore(newDueDate, startDate)) {
				return {
					success: false,
					message: "Due date cannot be before the project start date",
				};
			}
		}

		// Format dates for activity messages (only convert once)
		const formattedNewDate = newDueDate
			? newDueDate.toLocaleDateString()
			: "none";

		const formattedOldDate = currentDueDate
			? currentDueDate.toLocaleDateString()
			: "none";

		// Find affected tasks - those with due dates after new project due date
		// Also exclude tasks that are done, archived or already in backlog
		const affectedTasks = newDueDate
			? targetProject.tasks.filter(
					(task) =>
						task.dueDate &&
						new Date(task.dueDate) > newDueDate &&
						!["DONE", "ARCHIVED", "BACKLOG"].includes(task.status)
				)
			: [];

		const noOfAffectedTasks = affectedTasks.length;

		// Prepare affected task IDs and activity data outside transaction
		const affectedTaskIds = affectedTasks.map((task) => task.id);
		const taskActivityData = affectedTasks.map((task) => ({
			taskId: task.id,
			oldDate: new Date(task.dueDate!).toLocaleDateString(),
			title: task.title,
			assigneeId: task.assigneeId,
		}));

		// Track if any tasks need status change
		const now = new Date();
		const isBeforeNewDueDate = newDueDate ? isBefore(newDueDate, now) : false;

		// Use a single transaction for all updates
		const result = await prisma.$transaction(async (tx) => {
			// Update the project due date
			const updatedProject = await tx.project.update({
				where: { id: projectId },
				data: {
					dueDate: dueDate,
					updatedAt: new Date(),
				},
			});

			// If there are affected tasks, update them all at once
			let updatedTasks: Task[] = [];
			let tasksWithStatusChange = 0;

			if (noOfAffectedTasks > 0 && newDueDate) {
				// Split updates based on whether status needs to change
				if (isBeforeNewDueDate) {
					// Update tasks that need status change to BACKLOG
					await tx.task.updateMany({
						where: {
							id: { in: affectedTaskIds },
							status: { notIn: ["DONE", "ARCHIVED", "BACKLOG"] },
						},
						data: {
							dueDate: newDueDate,
							updatedAt: new Date(),
							status: "BACKLOG",
						},
					});

					// Count tasks with status change
					tasksWithStatusChange = affectedTaskIds.length;
				} else {
					// Just update due dates without changing status
					await tx.task.updateMany({
						where: { id: { in: affectedTaskIds } },
						data: {
							dueDate: newDueDate,
							updatedAt: new Date(),
						},
					});
				}

				// Fetch the updated tasks
				updatedTasks = await tx.task.findMany({
					where: { id: { in: affectedTaskIds } },
				});

				// Create activity records for each task
				const taskActivities = await Promise.all(
					taskActivityData.map((data) => {
						const statusMessage = isBeforeNewDueDate
							? " and moved to BACKLOG status (due date is in the past)"
							: "";

						return createActivity(
							"TASK_UPDATED",
							`/dashboard/tasks/${data.taskId}`,
							`Task "${data.title}" due date adjusted from ${data.oldDate} to ${formattedNewDate}${statusMessage}`,
							data.taskId,
							projectId
						);
					})
				);

				// Check for any activity creation failures
				const failedActivities = taskActivities.filter(
					(activity) => !activity.success
				);
				if (failedActivities.length > 0) {
					console.warn(
						`Failed to create activity records for ${failedActivities.length} tasks`
					);
				}

				// Create notifications for task assignees (if different from project owner)
				const assigneeNotifications = await Promise.all(
					taskActivityData
						.filter((data) => data.assigneeId && data.assigneeId !== userId)
						.map((data) =>
							createNotification(
								"Task Due Date Changed",
								`The due date for task "${data.title}" has been changed to ${formattedNewDate} due to project deadline update.`,
								data.assigneeId!,
								`/dashboard/tasks/${data.taskId}`
							)
						)
				);

				// Check for notification failures
				const failedNotifications = assigneeNotifications.filter(
					(notif) => !notif.success
				);
				if (failedNotifications.length > 0) {
					console.warn(
						`Failed to create notifications for ${failedNotifications.length} task assignees`
					);
				}
			}

			// Create activity record for project (using projectId, not empty string)
			const projectActivity = await createActivity(
				"PROJECT_UPDATED",
				`/dashboard/projects/${projectId}`,
				`Project due date updated from ${formattedOldDate} to ${formattedNewDate}`,
				projectId,
				projectId
			);

			// Create notification for project owner
			const notification = await createNotification(
				"Project Updated",
				`${updatedProject.name} due date has been updated to ${formattedNewDate}. ${
					noOfAffectedTasks > 0
						? ` ${noOfAffectedTasks} task(s) affected.`
						: "No tasks were affected."
				}`,
				userId,
				`/dashboard/projects/${projectId}`
			);

			return {
				updatedProject,
				updatedTasks,
				projectActivity,
				notification,
				tasksWithStatusChange,
			};
		});

		// Check for notification and activity creation failures
		if (!result.projectActivity.success) {
			console.warn(
				"Failed to create activity record for project due date update"
			);
		}

		if (!result.notification.success) {
			console.warn("Failed to create notification for project due date update");
		}

		// Return success with detailed information about affected tasks
		const statusChangeMessage =
			result.tasksWithStatusChange > 0
				? ` (${result.tasksWithStatusChange} moved to BACKLOG status)`
				: "";

		return {
			success: true,
			message:
				noOfAffectedTasks > 0
					? `Project due date updated to ${formattedNewDate}. ${noOfAffectedTasks} task(s) affected.`
					: `Project due date updated to ${formattedNewDate}. No tasks were affected.`,
		};
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? `Error updating project due date: ${error.message}`
					: "Unknown error occurred updating project due date",
		};
	}
};
