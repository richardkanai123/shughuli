"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

export const ClearNotifications = async (): Promise<{
	message: string;
	success: boolean;
}> => {
	try {
		const session = await Authenticate();

		const { count } = await prisma.notification.deleteMany({
			where: {
				userId: session.userId,
			},
		});
		return {
			message: `Deleted ${count} notifications successfully`,
			success: true,
		};
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, success: false };
		}

		return { message: "An unexpected error occurred", success: false };
	}
};
