"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

export const MarkNotificationAsRead = async (
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
			return { message: "You are not authorized to mark this notification as read", success: false };
        }
        
        if (notification.isRead) {
			return { message: "Notification is already marked as read", success: false };
		}

		await prisma.notification.update({
			where: {
				id: notificationId,
			},
			data: {
				isRead: true,
			},
		});

		return { message: "Notification marked as read", success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { message: error.message, success: false };
		}

		return { message: "An unexpected error occurred", success: false };
	}
};
