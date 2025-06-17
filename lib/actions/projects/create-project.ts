"use server";
import prisma from "@/lib/prisma";
import {
	NewProjectSchemaType,
	newProjectSchema,
} from "@/lib/validation/schemas";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";

export const createProject = async (
	projectData: NewProjectSchemaType
): Promise<{ status: number; message: string; data: string | null }> => {
	try {
		// Validate input exists
		if (!projectData) {
			return {
				status: 400,
				message: "Bad Request, project data is required",
				data: null,
			};
		}

		// Authenticate user
		const session = await Authenticate();

		// Verify ownership
		if (session.userId !== projectData.ownerId) {
			return {
				status: 401,
				message: "Unauthorized - you can only create projects for yourself",
				data: null,
			};
		}

		// Add default start date if not provided
		const dataWithDefaults = {
			...projectData,
			startDate: projectData.startDate || new Date(),
		};

		// Validate with schema
		const validationResult = newProjectSchema.safeParse(dataWithDefaults);
		if (!validationResult.success) {
			return {
				status: 400,
				message:
					"Invalid project data. Please check your inputs and try again.",
				data: null,
			};
		}

		// Extract validated data
		const {
			name,
			description,
			ownerId,
			isPublic,
			slug,
			status,
			dueDate,
			startDate,
		} = validationResult.data;

		try {
			// Use transaction for atomicity
			const [project, activityResult] = await prisma.$transaction(
				async (tx) => {
					// Create the project
					const newProject = await tx.project.create({
						data: {
							name,
							slug,
							description,
							ownerId,
							isPublic,
							status,
							dueDate,
							startDate,
						},
					});

					// Create an activity record
					const link = `/dashboard/projects/${newProject.slug}`;
					const content = `You have created ${newProject.name}`;

					const activity = await createActivity(
						"PROJECT_CREATED",
						link,
						content,
						"",
						newProject.id
					);

					return [newProject, activity];
				}
			);

			// Log warning if activity creation failed but don't fail the operation
			if (!activityResult.success) {
				console.warn("Activity creation failed", {
					error: activityResult.message,
					projectId: project.id,
				});
			}

			// Return success response
			return {
				status: 201,
				message: "Project created successfully",
				data: `${project.name} has been created successfully.`,
			};
		} catch (dbError: any) {
			// Handle specific database errors
			if (dbError.code === "P2002" && dbError.meta?.target?.includes("slug")) {
				return {
					status: 409,
					message:
						"A project with this name already exists. Please use a different name.",
					data: null,
				};
			}

			// Re-throw for general handler
			throw dbError;
		}
	} catch (error) {
		// Return appropriate error response
		if (error instanceof Error) {
			return {
				status: 500,
				message: `Internal Server Error: ${error.message}`,
				data: null,
			};
		}

		return {
			status: 500,
			message: "An unexpected error occurred",
			data: null,
		};
	}
};
