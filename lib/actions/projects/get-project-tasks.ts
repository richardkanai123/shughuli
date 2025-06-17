'use server';
import { Task } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { Authenticate } from "../AuthProtection";

type ProjectTasksResponse = {
  status: number;
  message: string;
  tasks: Task[] | null;
};

export const GetProjectTasks = async (
  projectId: string
): Promise<ProjectTasksResponse> => {
  try {
    // Authenticate user
    const session = await Authenticate();
    const userId = session.userId;

    // Validate input
    if (!projectId) {
      return {
        status: 400,
        message: "Project ID is required",
        tasks: null,
      };
    }

    // First check if project exists and user has access
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,               // Only select the fields we need
        isPublic: true,
        ownerId: true,
      },
    });

    // Handle access control
    if (!project) {
      return {
        status: 404,
        message: "Project not found or you don't have access",
        tasks: null,
      };
    }

    // Fetch tasks with optimized query
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: 200,
      message: tasks.length > 0 
        ? ` ${tasks.length} Tasks retrieved successfully` 
        : "No tasks found for this project",
      tasks: tasks,
    };
    
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error 
        ? `Error retrieving tasks: ${error.message}` 
        : "An unexpected error occurred",
      tasks: null,
    };
  }
};
