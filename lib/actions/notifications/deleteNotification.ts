"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

export const DeleteNotification = async (
	notificationId: string
): Promise<{
	message: string;
	success: boolean;
}> => {
	try {
		const session = await Authenticate();

		if (!session || !notificationId) {
			return { message: "Unauthorized", success: false };
		}

		const notification = await prisma.notification.findUnique({
			where: {
				id: notificationId,
			},
		});

		if (!notification) {
			return { message: "Invalid notification", success: false };
		}

		if (notification.userId !== session.userId) {
			return {
				message: "You are not authorized to delete this notification",
				success: false,
			};
		}

		await prisma.notification.delete({
			where: {
				id: notificationId,
			},
		});
		return { message: "Notification deleted successfully", success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, success: false };
		}

		return { message: "An unexpected error occurred", success: false };
	}
};
