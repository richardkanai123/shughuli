import {  Task } from "@/lib/generated/prisma";

export const GetUserProjects = async (userId: string): Promise<{
    tasks: Task[] | null;
    message: string;
    status: number;
}> => {
    const res = await fetch(`${process.env.BASE_URL}/api/tasks?user=${userId}`, { cache: "no-store" });
    const data = await res.json();
    return {
        tasks: data.tasks,
        message: data.message,
        status: res.status
    }
};