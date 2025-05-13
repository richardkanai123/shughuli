import { Notification } from "@/lib/generated/prisma";

export const GetUserNotifications = async (userId: string): Promise<{
    notifications: Notification[] | null;
    message: string;
    status: number;
}> => {
    const res = await fetch(`${process.env.BASE_URL}/api/notifications?user=${userId}`, { cache: "no-store" });
    const data = await res.json();
    return {
        notifications: data.notifications,
        message: data.message,
        status: res.status
    }
};