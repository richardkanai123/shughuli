'use server'
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NewProjectSchemaType, newProjectSchema } from "@/lib/validation/schemas";import { headers } from "next/headers";
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
            startDate: new Date(projectData.startDate),
            endDate: new Date(projectData.endDate),
            isPublic: projectData.isPublic,
            status: projectData.status,
            slug: projectData.slug,
            ownerId: projectData.ownerId
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
                    endDate,
                    isPublic,
                    slug,
                    startDate,
                    status,
                } = isValid.data;
                const project = await prisma.project.create({
                    data: {
                        name,
                        slug,
                        description,
                        ownerId,
                        endDate,
                        isPublic,
                        startDate,
                        status,
                    },
                });
              
         
         if(!project) {
            return { status: 500, message: "Internal Server Error: Failed to create project", data: null };
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