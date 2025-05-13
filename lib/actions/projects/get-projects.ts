import {  Project } from "@/lib/generated/prisma";

export const GetUserProjects = async (userId: string): Promise<{
    projects: Project[] | null;
    message: string;
    status: number;
}> => {
    const res = await fetch(`${process.env.BASE_URL}/api/projects?user=${userId}`, { cache: "no-store" });
    const data = await res.json();
    return {
        projects: data.projects,
        message: data.message,
        status: res.status
    }
};