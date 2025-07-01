'use client';
import { ExternalLink, Download, Image as ImageIcon, FileIcon } from "lucide-react";
import { useMemo } from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Attachments } from "@/lib/generated/prisma";
import DeleteAttachmentBtn from "../../buttons/DeleteAttachmentBtn";

// Further component extraction for attachment items
const AttachmentItem = ({ attachment }: { attachment: Attachments }) => {
    const { fileType, fileName, url } = attachment;

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
                <div className="flex items-center gap-4">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline hover:text-primary"
                    >
                        <ExternalLink className="h-6 w-6" />
                    </a>
                    <a
                        href={url}
                        download={fileName}
                        className="text-primary hover:underline hover:text-primary"
                    >
                        <Download className="h-6 w-6" />
                    </a>


                    <DeleteAttachmentBtn attachmentid={attachment.id} />
                </div>
            </CardFooter>
        </Card>
    );
};

export default AttachmentItem;