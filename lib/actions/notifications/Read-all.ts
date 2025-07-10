"use server";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

export const ReadAllNotifications = async (): Promise<{
    message: string;
    success: boolean;
}> => {
    try {
        const session = await Authenticate();


        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.userId,
            },
        });

        if (notifications.length === 0) {
            return { message: "No notifications found", success: false };
        }

        // Check if all notifications are already read
        const allRead = notifications.every(notification => notification.isRead);
        if (allRead) {
            return { message: "All notifications are already read", success: false };
        }

        // Mark all notifications as read
        const { count } = await prisma.notification.updateMany({
            where: {
                userId: session.userId,
            },
            data: {
                isRead: true,
            },
        });

        if (count === 0) {
            return { message: "No unread notifications to mark as read", success: false };
        }
    
        return {
            message: `Marked ${count} notifications as read successfully`,
            success: true,
        };
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message, success: false };
        }

        return { message: "An unexpected error occurred", success: false };
    }
};
