'use client'
import {
    Paperclip,
} from "lucide-react"
import { motion } from "framer-motion"
import { use } from "react"
import { Attachments } from "@/lib/generated/prisma"
import ErrorAlert from "@/components/Public_Components/ErrorAlert"
import Uploader from "../../buttons/attatchment_uploader"
import AttachmentItem from "./AttachmentItem"



const ProjectAttachments = ({ attachments, projectid }: {
    attachments: Promise<{
        success: boolean;
        message: string;
        attachments?: null | Attachments[];
    }>,
    projectid: string
}) => {


    const attachmentsData = use(attachments);
    const { success, message, attachments: attachmentList } = attachmentsData;

    if (!success) {
        return <ErrorAlert ErrorMessage={message} />;
    }

    if (!attachmentList || attachmentList.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground border rounded-md">
                <Paperclip className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">No attachments yet</p>
                <p className="text-xs mt-1">Add files to this project for easy access</p>

                <Uploader projectid={projectid} />
            </div>
        );
    }


    // If attachments are available, render the component

    return (
        <motion.div
            className="bg-card p-4 rounded-md shadow-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                    <span>Attachments</span>
                </div>
                {/* Add Attachment Button */}
                <div className="my-4 mx-auto">
                    <Uploader projectid={projectid} />
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {attachmentList.map((attachment, id) => (
                    <AttachmentItem key={id} attachment={attachment} />
                ))}
            </div>

        </motion.div >
    )
}



export default ProjectAttachments