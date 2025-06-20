"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { createActivity } from "../activity/create-activity";

export const updateDueDate = async (taskId: string, dueDate: Date ) => {
	try {
		if (!taskId) {
			return {
				success: false,
				message: "Task ID is required",
			};
		}

		// Authenticate user
		const session = await Authenticate();
		const userid = session.userId;

		// Get task with necessary related data
		const targetTask = await prisma.task.findUnique({
			where: {
				id: taskId,
			},
			select: {
				id: true,
				title: true,
				projectId: true,
				creatorId: true,
				assigneeId: true,
				dueDate: true,
				createdAt: true,
				project: {
					select: {
						id: true,
						name: true,
						dueDate: true,
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

		const isProjectOwner = targetTask.project.ownerId === userid;
		const isTaskCreator = targetTask.creatorId === userid;
		const isTaskAssignee = targetTask.assigneeId === userid;

		if (!isProjectOwner && !isTaskCreator && !isTaskAssignee) {
			return {
				success: false,
				message: "You do not have permission to update this task",
			};
		}

		// Validate due date against project due date
		const projectDueDate = targetTask.project.dueDate;
		
		const isAfterProjectDueDate = isAfter(dueDate, projectDueDate);
		const isBeforeTaskCreatedAt = isBefore(dueDate, targetTask.createdAt);
	
        const isValidDueDate = !isAfterProjectDueDate && !isBeforeTaskCreatedAt;
        
        if (!isValidDueDate) {
            const DatesErrorMessage = isAfterProjectDueDate
                ? `Due date cannot be after project due date (${new Date(projectDueDate).toLocaleDateString()})`
                : `Due date cannot be before task creation date (${new Date(targetTask.createdAt).toLocaleDateString()})`;
            return {
                success: false,
                message: DatesErrorMessage,
            };
        }

		// Format date for display
		const formattedNewDate = dueDate
			? new Date(dueDate).toLocaleDateString()
			: "none";

		const formattedOldDate = targetTask.dueDate
			? new Date(targetTask.dueDate).toLocaleDateString()
			: "none";

		// No change needed if dates are the same
		if (
			(dueDate &&
				targetTask.dueDate &&
				isSameDay(new Date(dueDate), new Date(targetTask.dueDate))) ||
			(!dueDate && !targetTask.dueDate)
		) {
			return {
				success: true,
				message: `Due date is already set to ${formattedNewDate}`,
			};
		}

		// Use transaction for atomicity
		const result = await prisma.$transaction(async (tx) => {
			// Update the task
			const updatedTask = await tx.task.update({
				where: {
					id: taskId,
				},
				data: {
					dueDate: dueDate,
					updatedAt: new Date(),
				},
			});

			// Create activity record
			const taskLink = `/dashboard/tasks/${targetTask.id}`;
			const content = `Task due date updated to ${formattedNewDate}`;

			const activity = await createActivity(
				"TASK_UPDATED",
				taskLink,
				content,
				targetTask.id,
				targetTask.projectId
			);

			return {
				updatedTask,
				activity,
			};
		});

		if (!result.activity.success) {
			console.warn("Failed to create activity for due date update");
		}

		return {
			success: true,
			message: `Due date updated from ${formattedOldDate} to ${formattedNewDate}`,
		};
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? `Error updating due date: ${error.message}`
					: "Unknown error occurred updating due date",
		};
	}
};
