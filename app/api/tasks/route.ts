// api route to get notifications for a user
import prisma from "@/lib/prisma";
import { newTaskSchema } from "@/lib/validation/schemas";
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

        const Tasks = await prisma.task.findMany({
            where: {
                
                OR: [
                    { creatorId: userid },
                    { assigneeId: userid },
                ]
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if(Tasks.length===0) return NextResponse.json({ message: "You have no Tasks", Tasks }, { status: 200 });
        return NextResponse.json({ Tasks:Tasks, message: "Tasks found" }, { status: 200 } );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500}  );
        }
        return NextResponse.json({ message: "Internal Server Error" }, {status: 500} );
        
    }
}


// create task
export async function POST(Request: NextRequest) {
    const body = await Request.json();
    const { taskData } = body;
    // validate task data
    const isValid = await newTaskSchema.safeParse(taskData);
    if (!isValid.success) {
        return NextResponse.json({ message: isValid.error.message }, { status: 400 });
    }
    const { title, description, creatorId, assigneeId, projectId,dueDate,priority,status,parentId } = isValid.data;
    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                creatorId,
                assigneeId,
                projectId,
                dueDate,
                priority,
                status,
                parentId
            },
        });
        return NextResponse.json({ task, message: "Task created successfully" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json( { message: error.message }, { status: 500 } );
        }
        return NextResponse.json({ message: "Internal Server Error"}, { status: 500 });
        
    }
}
