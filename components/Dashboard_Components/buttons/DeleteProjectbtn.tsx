"use client";
import { DeleteProject } from "@/lib/actions/projects/delete-project";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DeleteProjectbtn = ({ projectid }: { projectid: string }) => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!projectid) return;

        try {
            setIsPending(true);
            const response = await DeleteProject(projectid);

            if (response.success) {
                toast.success(response.message || "Project deleted successfully");
                router.push("/dashboard/projects");
                router.refresh();
            } else {
                toast.error(response.message || "Failed to delete project");
            }
        } catch (error) {
            console.error("Delete project error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsPending(false);
        }
    };

    if (!projectid) {
        return null;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            disabled={isPending}
                            variant="destructive"
                            size="sm"
                            className="h-9"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-destructive/10">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="space-y-3">
                                <p>Are you sure you want to delete this project?</p>

                                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-destructive">
                                            <p className="font-medium mb-1">Warning:</p>
                                            <p>This action cannot be undone. All project data, tasks, and attachments will be permanently deleted.</p>
                                        </div>
                                    </div>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive hover:bg-destructive/90"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Project
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>Delete project permanently</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default DeleteProjectbtn;