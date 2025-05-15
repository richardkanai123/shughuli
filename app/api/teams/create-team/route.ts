
// create team Route
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { teamSchema } from "@/lib/validation/schemas"

export async function POST(req: NextRequest) {
    const body = await req.json()

    try {
        // check auth
        const token = req.cookies.get('auth_token')?.value
        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (!session || !token) {
            return NextResponse.json({ status: 401, body: { message: "Unauthorized" } })
        }

        const isValid = await teamSchema.safeParseAsync(body)
        if (!isValid.success) {
            return NextResponse.json({ status: 400, body: { message: isValid.error.message } })
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

        return NextResponse.json({ status: 200, body: { message: "Team created successfully" } })


    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json({ status: 500, body: { message: error.message } })
        }
        return NextResponse.json({ status: 500, body: { message: "Internal Server Error" } })
        
    }
    
}