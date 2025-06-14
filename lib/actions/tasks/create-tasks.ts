"use server";
import prisma from "@/lib/prisma";
import { newTaskSchema, NewTaskSchemaType } from "@/lib/validation/schemas";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";

export const createTask = async (taskData: NewTaskSchemaType) => {
	try {

		const session = await Authenticate()
		const parsedData = newTaskSchema.safeParse(taskData);
		if (!parsedData.success) {
			return {
				success: false,
				message: parsedData.error.issues[0].message,
				data: null,
			};
		}
		
		// check if project exists
		const project = await prisma.project.findUnique({
			where: {
				id: parsedData.data.projectId,
			},
		});
		if (!project) {
			return {
				success: false,
				message: "Project not found",
				data: null,
			};
		}

		const newTask = await prisma.task.create({
			data: {
				title: parsedData.data.title,
				description: parsedData.data.description,
				projectId: parsedData.data.projectId,
				creatorId: session.userId,
				status: parsedData.data.status,
				priority: parsedData.data.priority,
				dueDate: parsedData.data.dueDate,
				assigneeId: parsedData.data.assigneeId,
				parentId: parsedData.data.parentId,
				startDate: parsedData.data.startDate,
				completedAt: parsedData.data.completedAt,
			},
			select: {
				id: true,
				title: true,
			},
		});

		// Create a new activity
		const link = `/dashboard/tasks/${newTask.id}`;
		const content = `You have created a new task: ${newTask.title}`;

		const activityResult = await createActivity(
			"TASK_CREATED",
			link,
			content,
			project.id,
			newTask.id
		);

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
