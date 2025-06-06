'use server'
import { Activity } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma"

export const GetRecentActivities = async (userId: string): Promise<{
    message: string;
    success: boolean;
    activities: null | Activity[];
}> => {
    try {
        const activities = await prisma.activity.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        })

        if (!activities || activities.length === 0) {
            return {
                message: "No recent activities found.",
                success: true,
                activities: null
            }
        }

        return {
            message: "Recent activities retrieved successfully.",
            success: true,
            activities
        }

    } catch (error) {
        if (error instanceof Error) {
            return {
                message: error.message,
                success: false,
                activities: null
            }
        }
        return {
            message: "An unexpected error occurred while retrieving recent activities.",
            success: false,
            activities: null
        }
    }
}


export const GetUserActivities = async (userId: string) => {
    try {
        const activities = await prisma.activity.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        if (!activities || activities.length === 0) {
            return {
                message: "No activities found for this user.",
                success: true,
                activities: null
            }
        }

        return {
            message: "User activities retrieved successfully.",
            success: true,
            activities
        }

    } catch (error) {
        if (error instanceof Error) {
            return {
                message: error.message,
                success: false,
                activities: null
            }
        }
        return {
            message: "An unexpected error occurred while retrieving user activities.",
            success: false,
            activites:null
        }
    }
}