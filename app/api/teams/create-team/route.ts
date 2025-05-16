
// create team Route
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { teamSchema } from "@/lib/validation/schemas"

export async function POST(req: NextRequest) {
    const body = await req.json()

    try {
        // check auth

        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (!session) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401 }) 
        }

        const isValid = await teamSchema.safeParseAsync(body)
        if (!isValid.success) {
            return NextResponse.json({message: isValid.error.message}, { status: 400 }) 
        }

        const { name, description } = isValid.data
        
        await prisma.team.create({
            data: {
                name,
                description,
                slug: name.toLowerCase().split(" ").join("-"),
                ownerId: session.userId,
                members: {
                    create: {
                        userId: session.userId,
                        role:"LEAD"
                    }
                }
            }
        })

        return NextResponse.json({message:"Team created successfully" }, { status: 201})


    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json({ status: 500, body: { message: error.message } })
        }
        return NextResponse.json({message: "Internal Server Error"}, { status: 500 })
        
    }
    
}