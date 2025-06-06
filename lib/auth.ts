import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
	appName: "Shughuli",
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BASE_URL,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 6,
		maxPasswordLength: 20,
		sendResetPassword: async ({ user, url }) => {
			// send reset password email
			const res = await fetch(`${process.env.BASE_URL}/api/reset-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: user.email,
					username: user.name,
					url,
				}),
			});
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			// send verification email
			const res = await fetch(`${process.env.BASE_URL}/api/verify`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: user.email,
					username: user.name,
					url,
				}),
			});

			const data = await res.json();
			if (res.status !== 200) {
				throw new Error(
					(data.message as string) || "Failed to send verification email"
				);
			}
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google"],
		},
	},

	socialProviders: {
		google: {
			// prompt: "consent",
			enabled: true,
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			// creation of a username when user signs up with google
			overrideUserInfoOnSignIn: true,
			mapProfileToUser: async ({ email,name,given_name, family_name,picture,email_verified }) => {
				return {
					email,
					name,
					image: picture,
					username: given_name.toLowerCase() + family_name.toLowerCase(),
					emailVerified:email_verified
				};
			}
		},
	},

	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				fieldName: "role",
			},
			username: {
				type: "string",
				required: true,
				fieldName: "username",
			},
		},
	},

	session: {
		cookieCache: {
			enabled: true,
			maxAge: 300,
		},
	},

	rateLimit: {
		enabled: true,
		window: 10,
		max: 50,
	},
	plugins: [
		customSession(async ({ session, user }) => {
			const customUser = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
				select: {
					role: true,
					username: true,
					image: true,
					email: true,
				},
			});

			return {
				...session,
				role: customUser?.role,
				username: customUser?.username,
				image: customUser?.image,
				email: customUser?.email,
			};
		}),
		nextCookies(),
	],
});
