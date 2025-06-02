'use server';
// updates project details
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
const projectSchema = z.object({
	name: z.string().min(3, {
		message: 'Project name must be at least 3 characters.',
	}),
	description: z.string().optional(),
	status: z.enum(["OPEN", "ONGOING", "COMPLETED", "CANCELLED", "ARCHIVED"], {
		required_error: 'Project status is required.',
	}),
	isPublic: z.boolean(),
	startDate: z.date().optional().nullable(),
	endDate: z.date().optional().nullable(),
	dueDate: z.date().optional().nullable(),
	progress: z.coerce
		.number()
		.min(0)
		.max(100, {
			message: 'Progress must be between 0 and 100.',
		}),
})

// type for the project data
type ProjectData = z.infer<typeof projectSchema>;

export const UpdateProject = async (projectId: string, data: ProjectData) => {

	try {
		if (!projectId) {
			return {
				success: false,
				message: "Project ID is required",
			};
		}

		if (!data || Object.keys(data).length === 0) {
			return {
				success: false,
				message: "Project data is required",
			};
		}

		const projectData = projectSchema.safeParse(data);
		if (!projectData.success) {
			return {
				success: false,
				message: projectData.error.errors.map(err => err.message).join(", "),
			};
		}

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

		const validatedData = {
			name: projectData.data.name,
			description: projectData.data.description,
			status: projectData.data.status,
			isPublic: projectData.data.isPublic,
			startDate: projectData.data.startDate ? new Date(projectData.data.startDate) : targetProject.startDate,
			endDate: projectData.data.endDate ? new Date(projectData.data.endDate) : targetProject.endDate,
			dueDate: projectData.data.dueDate ? new Date(projectData.data.dueDate) : targetProject.dueDate,
			progress: projectData.data.progress,
		};

		const updatedProject = await prisma.project.update({
			where: { id: projectId },
			data: {
				...validatedData,
			},
		});

		return {
			success: true,
			message: `Project ${updatedProject.name} updated successfully`,
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
