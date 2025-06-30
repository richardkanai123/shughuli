"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";
import { Attachments } from "@/lib/generated/prisma";

interface FileAttachment {
	url: string;
	fileName: string;
	fileType: string;
}

export async function addProjectAttachment(
	projectid: string,
	files: FileAttachment[]
) {
	try {
		// Authenticate the user
		const session = await Authenticate();
		if (!session) {
			return { success: false, message: "Unauthorized" };
		}
		const userId = session?.userId;
		// Validate the input
		if (files.length === 0) {
			return {
				success: false,
				message: "Invalid input: files must be a non-empty array.",
			};
		}

		if (!projectid || typeof projectid !== "string") {
			return {
				success: false,
				message: "Invalid input: projectid must be a valid string.",
			};
		}

		// Check if the project exists and belongs to the user
		const project = await prisma.project.findUnique({
			where: { id: projectid },
		});

		if (!project) {
			return {
				success: false,
				message:
					"Project not found or you do not have permission to access it.",
			};
		}

		const isOwner = project.ownerId === userId;

		if (!isOwner) {
			return {
				success: false,
				message:
					"You do not have permission to add attachments to this project.",
			};
		}

		if (files.length > 2) {
			return {
				success: false,
				message: "You can only upload a maximum of 2 files at a time.",
			};
		}

		// Create attachments in the database
		const attachments = await prisma.attachments.createMany({
			data: [
				...files.map((file) => ({
					projectId: projectid,
					userId: userId,
					url: file.url,
					fileName: file.fileName,
					fileType: file.fileType,
				})),
			],
			skipDuplicates: true, // Skip duplicates if any
		});

		return {
			success: true,
			message: `Attachment added successfully, (${attachments.count} files uploaded)`,
		};
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? `Error retrieving tasks: ${error.message}`
					: "An unexpected error occurred, please try again later.s",
		};
	}
}

export const getProjectAttachments = async (projectid: string): Promise<{
	success: boolean;
	message: string;
	attachments?: null | Attachments[];
}> => {
	try {
		// Authenticate the user
		const session = await Authenticate();
		if (!session) {
			return { success: false, message: "Unauthorized" };
		}
		const userId = session?.id;

		// Validate the input
		if (!projectid || typeof projectid !== "string") {
			return {
				success: false,
				message: "Invalid input: projectid must be a valid string.",
			};
		}

		// Check if the project exists and belongs to the user
		const project = await prisma.project.findUnique({
			where: { id: projectid },
		});

		if (!project) {
			return {
				success: false,
				message:
					"Project not found or you do not have permission to access it.",
			};
		}

		const isOwner = project.ownerId === userId;
		const isPublic = project.isPublic;

		if (!isOwner && !isPublic) {
			return {
				success: false,
				message:
					"You do not have permission to view attachments for this project.",
			};
		}

		// Retrieve attachments from the database
		const attachments = await prisma.attachments.findMany({
			where: { projectId: projectid },
		});

		return {
			success: true,
			message: "Attachments retrieved successfully",
			attachments,
		};
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? `Error retrieving tasks: ${error.message}`
					: "An unexpected error occurred, please try again later.",
		};
	}
};
