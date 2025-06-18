"use server";
import { Task } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

export const GetUserTasks = async (
	userId: string
): Promise<{
	tasks: Task[] | null;
	message: string;
	status: number;
}> => {
	try {
		// Validate input
		if (!userId || userId.trim() === "") {
			return {
				tasks: null,
				message: "User ID is required",
				status: 400,
			};
		}

		// Authenticate user
		const session = await Authenticate();

		// Verify the user is requesting their own tasks
		if (session.userId !== userId) {
			return {
				tasks: null,
				message: "Unauthorized - you can only view your own tasks",
				status: 403,
			};
		}

		// Fetch tasks with optimized query that includes assigned tasks
		const tasks = await prisma.task.findMany({
			where: {
				OR: [
					{ creatorId: userId }, // Tasks created by user
					{ assigneeId: userId }, // Tasks assigned to user
				],
			},
			orderBy: {
				createdAt: "desc", // Most recent first
			},
		});

		// Return consistent response for empty results
		if (tasks.length === 0) {
			return {
				tasks: [],
				message: "You have no tasks",
				status: 200,
			};
		}

		// Success case
		return {
			tasks,
			message: "Tasks fetched successfully",
			status: 200,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				tasks: null,
				message: `Failed to fetch tasks: ${error.message}`,
				status: 500,
			};
		}

		return {
			tasks: null,
			message: "Internal Server Error",
			status: 500,
		};
	}
};
