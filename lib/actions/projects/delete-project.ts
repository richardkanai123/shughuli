'use server';
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const DeleteProject = async (id: string) => {

	console.log("DeleteProject called with ID:", id);
	try {
		if (!id) {
			return {
				success: false,
				message: "Project ID is required",
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

		const targetProject = await prisma.project.delete({
			where: {
				id: id,
			},
			select: {
				name: true,
				ownerId: true,
			},
		});

		if (targetProject.ownerId !== session.userId) {
			return {
				success: false,
				message: "You do not have permission to delete this project",
			};
		}

		if (!targetProject) {
			return {
				success: false,
				message: "Project not found",
			};
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
			message: "Internal Server Error",
		};
	}
};
