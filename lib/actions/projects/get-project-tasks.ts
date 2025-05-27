import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const GetProjectTasks = async (projectId: string) => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return {
				tasks: null,
				message: "Unauthorized",
				status: 401,
			};
		}
		if (!projectId) {
			return {
				status: 400,
				message: "Project ID is required",
				tasks: null,
			};
		}
		// check if project exists
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
			include: {
				tasks: true,
			},
		});

		if (!project) {
			return {
				status: 404,
				message: "Project not found",
				tasks: null,
			};
		}

		const tasks = project.tasks;

		if (!tasks || tasks.length === 0) {
			return {
				status: 200,
				message: "No tasks found for this project",
				tasks: [],
			};
		}

		return {
			status: 200,
			message: "Tasks retrieved successfully",
			tasks: tasks,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: 500,
				message: error.message,
				tasks: null,
			};
		}

		return {
			status: 500,
			message: "An unexpected error occurred",
			tasks: null,
		};
	}
};
