'use server'
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { newTaskSchema, NewTaskSchemaType } from "@/lib/validation/schemas";
import { headers } from "next/headers";


export const createTask = async (taskData: NewTaskSchemaType) => {
    try {
    const parsedData = newTaskSchema.safeParse(taskData)
    if (!parsedData.success) {
        return {
            success: false,
            message: parsedData.error.issues[0].message,
            data: null
        }
    }
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return {
                success: false,
                message: "Unauthorized",
                data: null
            }
        }

        // check if project exists
        const project = await prisma.project.findUnique({
            where: {
                id: parsedData.data.projectId
            }
        })
        if (!project) {
            return {
                success: false,
                message: "Project not found",
                data: null
            }
        }

        const newTask = await prisma.task.create({
            data: {
                title: parsedData.data.title,
                description: parsedData.data.description,
                projectId: parsedData.data.projectId,
                creatorId: session.userId,
                status: parsedData.data.status,
                priority: parsedData.data.priority,
                dueDate: parsedData.data.dueDate,
                assigneeId: parsedData.data.assigneeId,
                parentId: parsedData.data.parentId,
                startDate: parsedData.data.startDate,
                completedAt: parsedData.data.completedAt
            }, 
            select: {
                id: true,
                title: true,
               
            }
        })
        return {
            success: true,
            message: `Task: ${newTask.title} created successfully`,
            data: newTask
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
        return {
            success: false,
            message: "Internal Server Error",
            data: null
        }   
    }

}