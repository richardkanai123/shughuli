
'use server'
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import {  revalidateTag } from "next/cache"
import { headers } from "next/headers"

export const createNotification = async (title: string, message: string, userId: string, link?: string) => {
    try {
        
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { success: false, error: "Unauthorized" }
        }

        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                userId,
                link
            }
        })
        revalidateTag("notification")

        return { success: true, notification }
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Internal Server Error" }
    }
}