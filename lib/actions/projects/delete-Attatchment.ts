'use server'
import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";
import { Authenticate } from "../AuthProtection";

export const deleteProjectAttachment = async (
    attachmentId: string,
): Promise<{ success: boolean; message: string }> => {
    try {

        const session = await Authenticate();

        const userId = session?.userId;
        if (!userId) {
            return { success: false, message: "You are not authorized to delete this attachment." };
        }

        if (!attachmentId || typeof attachmentId !== "string") {
            return { success: false, message: "Invalid attachment ID." };
        }

        const deleteFilesApi = new UTApi();

        const targetAttachment = await prisma.attachments.findUnique({
            where: { id: attachmentId },
        });

        if (!targetAttachment) {
            return {
                success: false,
                message: "Attachment not found or you do not have permission to delete it.",
            };
        }

        const attachmentKey = targetAttachment.key;

        const { deletedCount, success } = await deleteFilesApi.deleteFiles(attachmentKey);

        if (!success || deletedCount === 0) {
            return { success: false, message: "No attachments were deleted." };
        }

        // If deletion is successful, remove the attachment records from the database
        await prisma.attachments.delete({
            where: { id: attachmentId },
        });

        return { success: true, message: "Attachment deleted successfully." };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? `Error deleting attachment: ${error.message}`
                    : "An unexpected error occurred, please try again later.",
        };
    }
};
