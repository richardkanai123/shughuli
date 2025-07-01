"use client";
import { UploadButton } from "@/lib/uploadThingUtils";
import React, { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import { addProjectAttachment } from "@/lib/actions/projects/project_attachment";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
const Uploader = ({ projectid }: { projectid: string }) => {
    const [uploadmsg, setUploadMsg] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const Router = useRouter()

    return (
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
                    <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={async (res) => {
                            if (!res || res.length === 0) {
                                setUploadMsg("No files uploaded.");
                                return;
                            }
                            setUploading(true);
                            // Loop through the response to get file details in an array
                            const files = res as ClientUploadedFileData<{
                                fileUrl: string;
                                fileName: string;
                                fileType: string;
                                key: string;

                            }>[];
                            // loop through the files and log their details
                            const uploadedfiles = files.map((file) => {
                                return {
                                    url: file.ufsUrl,
                                    fileName: file.name,
                                    fileType: file.type,
                                    key: file.key,
                                };
                            });

                            // Call the server action to add the project attachment
                            const { message, success } = await addProjectAttachment(projectid, uploadedfiles)
                            if (success) {
                                setUploadMsg(message || "Files uploaded successfully.");
                                Router.refresh()
                            } else {
                                setUploadMsg(`Error: ${message}`);
                                Router.refresh()
                            }
                            setUploading(false);

                        }}
                        onUploadError={(error) => {
                            toast.error(`Upload failed: ${error.message}`);
                        }}
                    />

                    <p className="text-sm text-muted-foreground text-center">
                        {uploading ? "Uploading..." : uploadmsg}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                        <p>Supported formats: JPG, PNG, PDF</p>
                        <p>Max file size: 8MB images and 16MB for other files</p>
                        <p>Max files: 2</p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={uploading}>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


    );
};

export default Uploader;
