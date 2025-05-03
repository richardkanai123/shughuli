import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Params } from "next/dist/server/request/params";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Params }
) {
	const session = await auth.api.getSession({
		headers: request.headers,
    });
    
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const { id } = await params;

	try {
		const user = await prisma.user.findUnique({
			where: { id: id as string },
			select: {
				id: true,
				email: true,
				name: true,
				username: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				image: true,
				emailVerified: true,
			},
		});
		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return { status: 500, body: { message: error.message } };
		}
		return { status: 500, body: { message: "Internal Server Error" } };
	}
}
