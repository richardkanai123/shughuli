import { auth } from "../auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export function withAuth(handler: (req: NextRequest) => Promise<Response>) {
	return async function (request: NextRequest) {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
		throw new Error("Unauthorized");
		}

		return NextResponse.next();
	};
}
