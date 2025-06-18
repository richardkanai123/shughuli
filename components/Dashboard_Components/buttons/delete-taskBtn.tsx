"use client";
import { DeleteTask } from "@/lib/actions/tasks/delete-task";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import { Loader, Trash2 } from "lucide-react";

const DeletetaskBtn = ({ taskId }: { taskId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter();
    const session = useSession();

    const handleDeleteTask = async () => {
        try {
            setIsLoading(true);

            if (!taskId) return;

            toast.promise(DeleteTask(taskId), {
                loading: "Deleting task...",
                success: ({ message, success }) => {
                    if (success) {
                        setIsLoading(false);
                        Router.push("/dashboard/tasks");
                        return message || "Task deleted successfully";
                    } else {
                        setIsLoading(false);
                        return "Failed to delete task";
                    }
                },
                error: (error) => {
                    setIsLoading(false);
                    Router.push("/dashboard/tasks");
                    return error.message || "Failed to delete task";
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(
                    error.message || "An error occurred while deleting the task"
                );
            }
            Router.push("/dashboard/tasks");
            setIsLoading(false);
        }
    };

    // Early return if no session
    if (!session) {
        return null;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="destructive"
                    onClick={handleDeleteTask}
                    disabled={isLoading}
                    className="min-w-[140px]">
                    {isLoading ? (
                        <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            Delete
                            <Trash2 className="h-4 w-4 ml-2" />
                        </>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <span>Click to delete the task</span>
            </TooltipContent>
        </Tooltip>
    );
};

export default DeletetaskBtn;
