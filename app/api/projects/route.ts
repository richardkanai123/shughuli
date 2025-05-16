import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { newProjectSchema } from "@/lib/validation/schemas";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(Request: NextRequest) {
	
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const userid = session?.userId

	try {
		if (!userid)
			return NextResponse.json(
				{ message: "Unable to fetch projects for user" },
				{ status: 404 }
			);

		// verify if user exists
		const user = await prisma.user.findUnique({
			where: {
				id: userid,
			},
		});
		if (!user)
			return NextResponse.json({ message: "User not found" }, { status: 404 });

		const Projects = await prisma.project.findMany({
			where: {
				OR: [
					{ ownerId: userid },
				],
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		if (Projects.length === 0)
			return NextResponse.json(
				{ message: "You have no Projects", Projects },
				{ status: 200 }
			);
		return NextResponse.json(
			{ projects: Projects, message: "Projects found" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({
				status: 500,
				body: { message: error.message },
			});
		}
		return NextResponse.json({
			status: 500,
			body: { message: "Internal Server Error" },
		});
	}
}

// create project
export async function POST(Request: NextRequest) {
	try {
		const body = await Request.json();
		const { projectData } = body;

		if (!projectData) {
			return NextResponse.json(
				{
					message: "Project data is required",
				},
				{ status: 400 }
			);
		}
		// validate project data
		const isValid = await newProjectSchema.safeParseAsync(projectData);
		if (!isValid.success) {
			return NextResponse.json(
				{
					message: `${isValid.error.message} due to ${isValid.error.cause || "unknown input data error"}`,
				},
				{ status: 400 }
			);
		}

		console.log(isValid.data);

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
		return NextResponse.json(
			{ project, message: "Project created successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.log(error);
		if (error instanceof Error) {
			return NextResponse.json(
				{
					message: error.message,
				},
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{
				message: "Internal Server Error",
			},
			{ status: 500 }
		);
	}
}
