"use server";
import prisma from "@/lib/prisma";
import { createActivity } from "../activity/create-activity";
import { Authenticate } from "../AuthProtection";
import { UTApi } from "uploadthing/server";
export const DeleteProject = async (id: string) => {
	try {
		if (!id) {
			return {
				success: false,
				message: "Project ID is required",
			};
		}

		const session = await Authenticate();



		const targetProject = await prisma.project.findUnique({
			where: {
				id: id,
			},
			select: {
				name: true,
				ownerId: true,
				slug: true,
				Attachments: {
					select: {
						key: true,
					}
				}
			},
		});

		// Check if the project exists and if the user is the owner
		if (!targetProject) {
			return {
				success: false,
				message: "Project not found",
			};
		}

		const projectAttachments = targetProject.Attachments;



		if (targetProject.ownerId !== session.userId) {
			return {
				success: false,
				message: "You do not have permission to delete this project",
			};
		}

		// Delete the project
		const deleteResult = await prisma.project.delete({
			where: {
				id: id,
			},
		});

		if (projectAttachments.length > 0) {
			const uploadThing = new UTApi();
			// Delete attachments using UploadThing API
			const deletePromises = projectAttachments.map(async (attachment) => {
				await uploadThing.deleteFiles(attachment.key);
			});
			await Promise.all(deletePromises);
		}

		// Create a new activity
		const link = `/dashboard/projects`;
		const content = `You have deleted ${targetProject.name}`;

		const activityResult = await createActivity(
			"PROJECT_DELETED",
			link,
			content,
			"",
			id
		);
		// Check if the activity was created successfully
		// Log a warning if the activity creation failed
		if (!activityResult.success || !deleteResult) {
			console.warn(
				"Failed to create activity record for project deletion:",
				activityResult.message
			);
		}

		return {
			success: true,
			message: `${targetProject.name} deleted successfully`,
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
			message: "Internal Server Error Occurred, please try again later.",
		};
	}
};
