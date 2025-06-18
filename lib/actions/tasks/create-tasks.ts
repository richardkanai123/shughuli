"use server";
import prisma from "@/lib/prisma";
import { newTaskSchema, NewTaskSchemaType } from "@/lib/validation/schemas";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";

export const createTask = async (taskData: NewTaskSchemaType) => {
	try {
		// Authenticate user
		const session = await Authenticate();
		const userId = session.userId;

		// Validate input data
		const parsedData = newTaskSchema.safeParse(taskData);
		if (!parsedData.success) {
			return {
				success: false,
				message: parsedData.error.issues[0].message,
				data: null,
			};
		}

		// Extract validated data
		const validatedTaskData = parsedData.data;
		const { projectId, assigneeId } = validatedTaskData;

		// Check if project exists AND user has permission (single query)
		const project = await prisma.project.findFirst({
			where: {
				id: projectId,
				OR: [
					{ ownerId: userId }, // User is project owner
				],
			},
			select: {
				id: true,
				name: true,
				ownerId: true,
			},
		});

		if (!project) {
			return {
				success: false,
				message:
					"Project not found or you don't have permission to create tasks in this project",
				data: null,
			};
		}

		// Use transaction for atomicity
		const [newTask, activityResult] = await prisma.$transaction(async (tx) => {
			// Create the task
			const task = await tx.task.create({
				data: {
					...validatedTaskData,
					creatorId: userId, // Ensure creator is current user
				},
				select: {
					id: true,
					title: true,
				},
			});

			// Create activity record
			const link = `/dashboard/tasks/${task.id}`;
			const content = `You have created a new task: ${task.title}`;

			const activity = await createActivity(
				"TASK_CREATED",
				link,
				content,
				projectId,
				task.id
			);

			return [task, activity];
		});

		// Log warning if activity creation failed
		if (!activityResult.success) {
			console.warn(
				"Failed to create activity record for task creation:",
				activityResult.message
			);
		}

		return {
			success: true,
			message: `Task: ${newTask.title} created successfully`,
			data: newTask,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
				data: null,
			};
		}
		return {
			success: false,
			message: "Internal Server Error",
			data: null,
		};
	}
};
