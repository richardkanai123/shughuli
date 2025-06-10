import 'server-only'
import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const Authenticate = cache(async () => {
	const session = await auth.api.getSession(
		{
			headers: await headers(),
		}
	);

	if (!session) {
		redirect('/sign-in')
	}

	return session
}
)