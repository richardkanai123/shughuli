"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { Authenticate } from "../AuthProtection";

export const createNotification = async (
	title: string,
	message: string,
	userId: string,
	link?: string
) => {
	try {
		const session = await Authenticate();
		if (!session || !userId || session.userId !== userId) {
			return { success: false, error: "Unauthorized" };
		}

		const notification = await prisma.notification.create({
			data: {
				title,
				message,
				userId,
				link,
			},
		});
		revalidateTag("notification");

		return { success: true, notification };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Internal Server Error" };
	}
};
