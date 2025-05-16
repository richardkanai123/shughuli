import { auth } from "@/lib/auth";
import { Notification } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const GetUserNotifications = async (userId: string): Promise<{
    notifications: Notification[] | null;
    message: string;
    status: number;
}> => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !userId) return { notifications: null, message: "Unauthorized", status: 401 };

    if(session.userId !== userId) return { notifications: null, message: "Unauthorized", status: 401 };

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) return { notifications: null, message: "Unauthorized", status: 404 };

    const notifications = await prisma.notification.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if(!notifications) return { notifications: null, message: "You have no notifications", status: 200 };
    return { notifications, message: "Notifications found", status: 200 }
};