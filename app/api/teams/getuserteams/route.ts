// lists all teams belonging to the current user
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(req: NextRequest) { 
    try {
        const session = await auth.api.getSession({
            headers: await headers()
         })
    if (!session) {
        return NextResponse.json({ status: 401, body: { message: "Unauthorized" } })
    }

    const teams = await prisma.team.findMany({
        where: {
            ownerId: session.userId
        }
    })

    if(!teams) {
        return NextResponse.json({ status: 404, body: { message: "No teams found" } })
    }

    return NextResponse.json(teams, { status: 200 })
    
    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json({ status: 500, body: { message: error.message } })
        }
        return NextResponse.json({ status: 500, body: { message: "Internal Server Error" } })
    }
}