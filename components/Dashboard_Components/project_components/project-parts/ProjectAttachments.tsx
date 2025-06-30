'use client'
import {
    Paperclip,
    PlusCircle,
    ExternalLink,
    Download,
    Image as ImageIcon,
    FileIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { use, useMemo } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Attachments } from "@/lib/generated/prisma"
import ErrorAlert from "@/components/Public_Components/ErrorAlert"
import Uploader from "../../buttons/attatchment_uploader"

// Utility function to determine file type and icon - moved outside component
const getFileTypeInfo = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

    if (imageTypes.includes(extension)) {
        return {
            icon: <ImageIcon className="h-4 w-4" />,
            type: 'Image'
        };
    }

    return {
        icon: <FileIcon className="h-4 w-4" />,
        type: 'Document'
    };
};


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

            {/* Attachments List */}
            {
                attachmentList && attachmentList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {attachmentList.map((attachment, id) => (
                            <AttachmentItem key={id} attachment={attachment} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground border rounded-md">
                        <Paperclip className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm">No attachments yet</p>
                        <p className="text-xs mt-1">Add files to this project for easy access</p>
                    </div>
                )
            }
        </motion.div >
    )
}

// Further component extraction for attachment items
const AttachmentItem = ({ attachment }: { attachment: Attachments }) => {
    const { fileType, fileName, url } = attachment;

    const isImage = useMemo(() => {
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        return imageTypes.includes(extension) || fileType.startsWith('image/');
    }, [fileName]);

    const fileInfo = useMemo(() => getFileTypeInfo(fileName), [fileName]);

    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border rounded-md overflow-hidden transition-colors hover:border-primary"
                >
                    {isImage ? (
                        <div className="aspect-square w-full bg-muted flex items-center justify-center relative">
                            {/* Image thumbnail */}
                            <img
                                src={url}
                                alt={fileName}
                                className="object-cover w-full h-full absolute inset-0"
                            />
                        </div>
                    ) : (
                        <div className="aspect-square w-full bg-muted flex items-center justify-center">
                            {fileInfo.icon}
                        </div>
                    )}
                    <div className="p-2">
                        <p className="text-xs font-medium truncate">
                            {fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {fileInfo.type}
                        </p>
                    </div>
                </a>
            </CardHeader>
            <CardFooter className="flex items-center justify-between p-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{fileType}</span>
                    <span className="text-xs">|</span>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                        href={url}
                        download={fileName}
                        className="text-primary hover:underline"
                    >
                        <Download className="h-4 w-4" />
                    </a>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ProjectAttachments