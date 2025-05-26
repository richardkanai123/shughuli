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
import { useMemo } from "react"
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

interface ProjectAttachmentsProps {
    attachments: string[]
    projectId: string
}

const ProjectAttachments = ({ attachments, projectId }: ProjectAttachmentsProps) => {
    return (
        <motion.div
            className="space-y-3"
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 px-2">
                            <PlusCircle className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">Add</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add Attachment</AlertDialogTitle>
                            <AlertDialogDescription>
                                Upload a file to attach to this project.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                            <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
                                <Paperclip className="h-6 w-6 mx-auto mb-2" />
                                <p>Drag & drop files here or click to browse</p>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Upload</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Attachments List */}
            {attachments && attachments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {attachments.map((attachment, index) => (
                        <AttachmentItem key={index} attachment={attachment} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-muted-foreground border rounded-md">
                    <Paperclip className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">No attachments yet</p>
                    <p className="text-xs mt-1">Add files to this project for easy access</p>
                </div>
            )}
        </motion.div>
    )
}

// Further component extraction for attachment items
const AttachmentItem = ({ attachment }: { attachment: string }) => {
    const fileInfo = useMemo(() => getFileTypeInfo(attachment || 'file'), [attachment]);
    const isImage = fileInfo.type === 'Image';
    const filename = useMemo(() => {
        // Extract filename from path
        return attachment.split('/').pop() || attachment;
    }, [attachment]);

    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
                <a
                    href={attachment || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border rounded-md overflow-hidden transition-colors hover:border-primary"
                >
                    {isImage ? (
                        <div className="aspect-square w-full bg-muted flex items-center justify-center relative">
                            {/* Image thumbnail */}
                            <img
                                src={attachment}
                                alt={filename}
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
                            {filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {fileInfo.type}
                        </p>
                    </div>
                </a>
            </CardHeader>
            <CardFooter className="w-64 p-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium truncate">{filename}</span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <a href={attachment} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <a href={attachment} download>
                                <Download className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                    </div>
                </div>
                {isImage && (
                    <div className="rounded-md overflow-hidden">
                        <img
                            src={attachment}
                            alt={filename}
                            className="w-full h-auto"
                        />
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default ProjectAttachments