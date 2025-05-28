// updates project details
import { auth } from "@/lib/auth";
import { ProjectStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const UpdateProject = async (projectId: string, data: FormData) => {
	try {
		if (!projectId) {
			return {
				success: false,
				message: "Project ID is required",
			};
		}
		if (!data || !(data instanceof FormData)) {
			return {
				success: false,
				message: "Invalid data provided",
			};
		}

		// Ensure the FormData contains the necessary fields
		const name = data.get("name");
		const description = data.get("description");
		const dueDate = data.get("dueDate");
		const progress = data.get("progress");
		const isPublic = data.get("isPublic");
		const status = data.get("status");
		const startDate = data.get("startDate") || new Date().toISOString(); // Default to current date if not provided
		const endDate = data.get("endDate");

		if (
			!name ||
			!description ||
			!dueDate ||
			!progress ||
			!isPublic ||
			!status
		) {
			return {
				success: false,
				message: "All fields are required",
			};
		}

		// Validate the types of the FormData values
		if (
			typeof name !== "string" ||
			typeof description !== "string" ||
			typeof dueDate !== "string" ||
			typeof progress !== "string" ||
			typeof isPublic !== "string" ||
			typeof status !== "string"
		) {
			return {
				success: false,
				message: "Invalid data types provided",
			};
		}

		// validdate the status value
		if (!Object.values(ProjectStatus).includes(status as ProjectStatus)) {
			return {
				success: false,
				message: "Invalid project status",
			};
		}

		// Convert FormData values to appropriate types
		const projectData = {
			name: name.toString(),
			description: description.toString(),
			dueDate: new Date(dueDate.toString()),
			progress: parseInt(progress.toString(), 10),
			isPublic: isPublic === "true",
			status: status as ProjectStatus,
			startDate: new Date(startDate.toString()),
			endDate: endDate ? new Date(endDate.toString()) : null, // Handle optional endDate
		};

		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return {
				success: false,
				message: "Unauthorized",
			};
		}

		const userId = session.userId;

		// Check if the project exists and belongs to the user
		const targetProject = await prisma.project.findUnique({
			where: { id: projectId },
		});

		if (!targetProject) {
			return {
				success: false,
				message: "Project not found",
			};
		}

		if (targetProject.ownerId !== userId) {
			return {
				success: false,
				message: "You do not have permission to update this project",
			};
		}

		const updatedProject = await prisma.project.update({
			where: { id: projectId },
			data: {
				description: projectData.description,
				name: projectData.name,
				dueDate: projectData.dueDate,
				progress: projectData.progress,
				isPublic: projectData.isPublic,
				status: projectData.status,
				startDate: projectData.startDate,
				endDate: projectData.endDate,
				updatedAt: new Date(), // Update the timestamp
			},
		});

		return {
			success: true,
			message: `Project ${updatedProject.name} updated successfully`,
			project: updatedProject,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
			};
		}
		return {
			success: false,
			message: "An unexpected error occurred",
		};
	}
};
