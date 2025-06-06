'use server'
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NewProjectSchemaType, newProjectSchema } from "@/lib/validation/schemas";import { headers } from "next/headers";
import { createActivity } from "../activity/create-activity";
 export const createProject = async (projectData: NewProjectSchemaType): Promise<{ status: number; message: string; data: string | null }>  => {
     try {
        if(!projectData) {
            return { status: 400, message: "Bad Request, project data is required", data: null };
        }
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    //  check session
     if(!session) {
        return { status: 401, message: "Unauthorized", data: null };
     }


     //  verify ownerid 
     if(session.userId !== projectData.ownerId) {
        return { status: 401, message: "Unauthorized", data: null };
         }
         
         const newProject = {
            name: projectData.name,
             description: projectData.description,
            dueDate: projectData.dueDate,
            isPublic: projectData.isPublic,
            status: projectData.status,
            slug: projectData.slug,
             ownerId: projectData.ownerId,
             startDate: projectData.startDate || new Date(), // Default to current date if not provided
         }

    // validate
    const isValid = await newProjectSchema.safeParse(newProject);
    if (!isValid.success) {
        return { status: 400,message: `${isValid.error.message} due to ${isValid.error.cause || 'unknown input data error'}`, data: null };
        }  
                const {
                    name,
                    description,
                    ownerId,
                    isPublic,
                    slug,
                    status,
                    dueDate,
                    startDate
                } = isValid.data;
                const project = await prisma.project.create({
                    data: {
                        name,
                        slug,
                        description,
                        ownerId,
                        isPublic,
                        status,
                        dueDate,
                        startDate
                    },
                });
              
         
         if(!project) {
            return { status: 500, message: "Internal Server Error: Failed to create project", data: null };
         }

         // Create a new activity
                     const link = `/dashboard/projects/${project.slug}`;
                     const content = `You have completed ${project.name}`;

                     const activityResult = await createActivity(
                         'PROJECT_CREATED', 
                         link, 
                         content, 
                         '', 
                         project.id
                     );
         
                     if (!activityResult.success) {
                         console.warn("Failed to create activity record for project completion:", activityResult.message);
                     }
         
        return { status: 201, message: "Project created successfully", data: `${project.name} has been added for ${session.username}` };
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            return { status: 500, message: error.message, data: null };
        }
        return { status: 500, message: "Internal Server Error", data: null };
    }
};