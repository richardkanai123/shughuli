// api route to get notifications for a user
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(Request: NextRequest) {
    const userid = Request.nextUrl.searchParams.get("user");
    try {
        if (!userid) return NextResponse.json({ message: "user identifier is required" }, { status: 404 });
        
        // verify if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userid,
            },
        });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const notifications = await prisma.notification.findMany({
            where: {
                userId: userid,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if(!notifications) return NextResponse.json({ message: "You have no notifications" }, { status: 200 });
        return NextResponse.json({ notifications, message: "Notifications found" }, { status: 200 } );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ status: 500, body: { message: error.message } });
        }
        return NextResponse.json({ status: 500, body: { message: "Internal Server Error" } });
        
    }
}