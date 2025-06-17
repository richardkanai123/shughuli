'use server';
import { Project } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

export const GetUserProjects = async (userId: string): Promise<{
    projects: Project[] | null;
    message: string;
    status: number;
}> => {
    try {
        // Validate input
        if (!userId || userId.trim() === '') {
            return { 
                projects: null, 
                message: "User ID is required", 
                status: 400 
            };
        }

        // Authenticate user
        const session = await Authenticate();
        
        // Verify the user is requesting their own projects
        if (session.userId !== userId) {
            return { 
                projects: null, 
                message: "Unauthorized - you can only view your own projects", 
                status: 403 
            };
        }
    
        // Fetch projects with optimal query
        const projects = await prisma.project.findMany({
            where: {
                ownerId: userId,
            },
            orderBy: {
                updatedAt: 'desc', // Most recently updated first
            },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                status: true,
                progress: true,
                dueDate: true,
                isPublic: true,
                createdAt: true,
                updatedAt: true,
                startDate: true,
                endDate: true,
                ownerId: true,
                attachments: true,
                // Avoid fetching owner and tasks unless needed
            },
        });
    
        // Return consistent response for empty results
        if (projects.length === 0) {
            return { 
                projects: [], // Return empty array instead of null for consistency
                message: "You have no projects", 
                status: 200 
            };
        }

        // Success case
        return {
            projects,
            message: "Projects fetched successfully",
            status: 200,
        }; 
    } catch (error) {
        console.error("Error in GetUserProjects:", error);
        
        if (error instanceof Error) {
            return { 
                projects: null, 
                message: `Failed to fetch projects: ${error.message}`, 
                status: 500 
            };
        }
        
        return { 
            projects: null, 
            message: "Internal Server Error", 
            status: 500 
        };
    }
};