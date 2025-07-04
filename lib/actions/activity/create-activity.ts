"use server"
import { ActivityType } from "@/lib/generated/prisma"
import prisma from "@/lib/prisma"
import { Authenticate } from "../AuthProtection"

export const createActivity = async (type:ActivityType, link:string, content:string, task:string, project:string) => {
    try {
        const session = await Authenticate();

        const userId = session.userId
        if (!userId) {
            return { 
                message: "User ID not found in session.",
                success: false
             }
        }

        const activity = await prisma.activity.create({
            data: {
                type,
                link,
                content,
                task: task ? { connect: { id: task } } : undefined,
                project: project ? { connect: { id: project } } : undefined,
                user: { connect: { id: userId } }
            }
        })

        if (!activity) {
            return { 
                message: "Failed to create activity. Please try again.",
                success: false
             }
        }

        return {
            message: "New activity recorded!",
            success: true,
        }

    } catch (error) {
        if (error instanceof Error) {
            return {
                message: error.message,
                success: false
            }
        }
        return {
            message: "An unexpected error occurred while creating the activity.",
            success: false
        }
    }
    
}