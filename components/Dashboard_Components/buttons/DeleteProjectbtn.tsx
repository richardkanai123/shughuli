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
import { Loader2Icon, Trash2Icon } from "lucide-react";
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

            // Call the delete function and capture its response
            const response = await DeleteProject(projectid);

            // Check the response
            if (response.success) {
                toast.success(response.message || "Project deleted successfully", {
                    duration: 3000,
                    position: "top-right",
                });

                // Redirect to projects list or dashboard
                router.push("/dashboard/projects");
                router.refresh();
            } else {
                toast.error(response.message || "Failed to delete project", {
                    duration: 3000,
                    position: "top-right",
                });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("Delete project error:", error);
            toast.error("An unexpected error occurred", {
                duration: 3000,
                position: "top-right",
            });
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
                            size="sm">
                            {isPending ? (
                                <>
                                    Delete <Loader2Icon className="h-4 w-4 animate-spin ml-1" />
                                </>
                            ) : (
                                <>
                                    Delete <Trash2Icon className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this project? This action cannot
                                be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white"
                                disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2Icon className="h-4 w-4 animate-spin mr-1" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
                <p>Delete project</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default DeleteProjectbtn;
