'use server';
import {  Task } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";


export const GetUserTasks = async (userId: string): Promise<{
    tasks: Task[] | null;
    message: string;
    status: number;
}> => {
    try {
     
        const session = await Authenticate()
        if (!session || !userId) return { tasks: null, message: "Unauthorized", status: 401 };

        const tasks = await prisma.task.findMany({
            where: {
                creatorId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            
        });

        if (!tasks) return { tasks: null, message: "Tasks not found", status: 404 };

        if (tasks.length === 0 || !tasks) return { tasks: null, message: "You have no tasks", status: 200 };
        return {
            tasks,
            message: "Tasks fetched successfully",
            status: 200,
        };
    } catch (error) {
        if (error instanceof Error) {
            return { tasks: null, message: error.message, status: 500 };
        }
        return { tasks: null, message: "Internal Server Error", status: 500 };
    }
};