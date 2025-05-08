// creates an invitation for a team
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const createInvitationSchema = z.object({
	teamId: z.string(),
	email: z.string().email(),
});

export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const isValid = await createInvitationSchema.safeParseAsync(body);
		if (!isValid.success) {
			return NextResponse.json(
				{ error: isValid.error.message },
				{ status: 400 }
			);
		}

		const { teamId, email } = isValid.data;

		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
		});

		if (!team) {
			return NextResponse.json({ error: "Team not found" }, { status: 404 });
		}

		if (team.ownerId !== session.userId) {
			return NextResponse.json(
				{ error: "Your are not the owner of this team" },
				{ status: 401 }
			);
		}

		const invitation = await prisma.teamInvitation.create({
			data: {
				teamId,
				email,
				invitedById: session.userId,
				token: crypto.randomUUID(),
			},
		});

		return NextResponse.json(invitation, { status: 200 });
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
