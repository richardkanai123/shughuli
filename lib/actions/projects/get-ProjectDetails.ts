"use server";
import { Project } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

// Wrap with cache for repeat calls with same parameters
export const getProjectDetails = async (
	projectIdOrSlug: string
): Promise<{
	project: Project | null;
	message: string;
	status: number;
}> => {
	try {
		const session = await Authenticate();
		const userId = session.userId;

		// UUID pattern for Prisma-generated IDs
		// This matches standard UUIDs: 8-4-4-4-12 hex digits separated by hyphens
		const uuidPattern =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

		const isId = uuidPattern.test(projectIdOrSlug);
		const project = await prisma.project.findUnique({
			where: isId ? { id: projectIdOrSlug } : { slug: projectIdOrSlug },
		});

		if (!project) {
			return {
				project: null,
				message: "Project not found",
				status: 404,
			};
		}
		// Check user access permissions
		const hasAccess = project.isPublic || project.ownerId === userId;

		if (!hasAccess) {
			return {
				project: null,
				message: "You do not have access to this project",
				status: 403,
			};
		}

		// Success case
		return {
			project,
			message: "Project fetched successfully",
			status: 200,
		};
	} catch (error) {
		return {
			project: null,
			message: error instanceof Error ? error.message : "Internal Server Error",
			status: 500,
		};
	}
};
