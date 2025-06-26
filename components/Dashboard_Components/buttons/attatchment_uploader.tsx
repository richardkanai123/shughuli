"use client";
import { UploadButton } from "@/lib/uploadThingUtils";
import React, { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";

const Uploader = ({ projectid }: { projectid: string }) => {
    const [uploadmsg, setUploadMsg] = useState<string>("");

    return (
        <div className="p-1">
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    if (!res || res.length === 0) {
                        setUploadMsg("No files uploaded.");
                        return;
                    }
                    // Loop through the response to get file details in an array
                    const files = res as ClientUploadedFileData<{
                        fileUrl: string;
                        fileName: string;
                        fileType: string;
                        uploadedBy: string;
                    }>[];
                    // Here you can handle the uploaded files, e.g., save them to your project
                    console.log("Uploaded files:", files);
                    setUploadMsg(`${files.length} uploaded successfully!`);


                }}
                onUploadError={(error) => {
                    setUploadMsg(`Error uploading file: ${error.message}`);
                }}
            />
            {uploadmsg && <p className="text-sm text-muted-foreground text-center">{uploadmsg}</p>}
        </div>
    );
};

export default Uploader;
