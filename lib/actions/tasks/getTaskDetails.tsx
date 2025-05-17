import { auth } from "@/lib/auth";
import { Task } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getTaskDetails(taskId: string): Promise<{ task: Task | null; message: string; status: number; }> {

    // check the id
    if (!taskId) {
        return { task: null, message: "Task ID is required", status: 400 };
    }

    try {

        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { task: null, message: "Unauthorized", status: 401 };
        }



        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!task) {
            return { task: null, message: "Task not found", status: 404 };
        }

        // check if the task belongs to the user or user is part of the project members
        const isTaskOwner = task.creatorId === session.userId;
        const isTaskMember = task.assigneeId === session.userId;

        if (!isTaskOwner && !isTaskMember) {
            return { task: null, message: "Forbidden", status: 403 };
        }

        return { task, message: "Task Found", status: 200 };
    } catch (error) {
        if (error instanceof Error) {
            return { task: null, message: error.message, status: 500 };
        }
        return { task: null, message: "Something went wrong", status: 500 };
    }
}