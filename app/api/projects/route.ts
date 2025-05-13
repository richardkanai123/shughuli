// api route to get notifications for a user
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(Request: NextRequest) {
    const userid = Request.nextUrl.searchParams.get("user");
    try {
        if (!userid) return NextResponse.json({ message: "user identifier is required" }, { status: 404 });

        const Projects = await prisma.project.findMany({
            where: {
                ownerId: userid,
                AND: {
                userId: userid
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if(Projects.length===0) return NextResponse.json({ message: "You have no Projects", Projects }, { status: 200 });
        return NextResponse.json({ Projects:Projects, message: "Projects found" }, { status: 200 } );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ status: 500, body: { message: error.message } });
        }
        return NextResponse.json({ status: 500, body: { message: "Internal Server Error" } });
        
    }
}