"use server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { teamSchema } from "@/lib/validation/schemas"
import { revalidatePath, revalidateTag } from "next/cache"
import { headers } from "next/headers"

export async function createTeam(data: FormData | { name: string; description?: string }) {
    try {
        // Get session
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { error: "Unauthorized", status: 401 }
        }

        // Prepare data for validation
        const formData = data instanceof FormData ? {
            name: data.get("name"),
            description: data.get("description")
        } : data

        // Validate data
        const validatedData = await teamSchema.safeParseAsync(formData)
        if (!validatedData.success) {
            return { 
                error: validatedData.error.message,
                status: 400 
            }
        }

        // Create team
        const team = await prisma.team.create({
            data: {
                name: validatedData.data.name,
                description: validatedData.data.description,
                slug: validatedData.data.name.toLowerCase().split(" ").join("-"),
                ownerId: session.userId,
                members: {
                    create: {
                        userId: session.userId,
                        role: "LEAD"
                    }
                }
            }
        })

        // Revalidate the teams page
        revalidatePath('/teams')
        revalidateTag('teams')

        return { 
            success: true, 
            team,
            message: "Team created successfully",
            status: 200 
        }

    } catch (error) {
        console.error("Team creation error:", error)
        
        return { 
            error: error instanceof Error ? error.message : "Failed to create team",
            status: 500 
        }
    }
}