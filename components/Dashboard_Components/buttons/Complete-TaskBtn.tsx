"use client";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CompleteTask } from "@/lib/actions/tasks/complete-task";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader, CheckCircle, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GrCompliance } from "react-icons/gr";
const CompleteTaskBtn = ({
    taskId,
    isComplete,
}: {
    taskId: string;
    isComplete: boolean;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession();
    const router = useRouter();


    const handleCompleteTask = async () => {
        if (!taskId || isLoading) return;

        setIsLoading(true);

        try {
            await toast.promise(
                CompleteTask(taskId),
                {
                    loading: "Completing task...",
                    success: ({ message, success }) => {
                        if (success) {
                            setIsLoading(false);
                            router.refresh();
                            return message || "Task completed successfully";
                        } else {
                            throw new Error(message || "Failed to complete task");
                        }
                    },
                    error: (error) => {
                        setIsLoading(false);
                        router.refresh();
                        return error.message || "Failed to complete task";
                    },
                },
                {
                    position: "top-right",
                    loading: {
                        icon: <Loader className="h-4 w-4 animate-spin" />,
                        position: "top-right",
                        removeDelay: 500,
                        iconTheme: {
                            primary: "#4a5568", // Gray-700
                            secondary: "#fff", // White
                        },
                        style: {
                            background: "#edf2f7", // Gray-100
                            color: "#2d3748", // Gray-800
                        },
                    },
                    success: {
                        icon: <CheckCircle className="h-4 text-lime-400 w-4" />,
                        position: "top-right",
                        removeDelay: 500,
                        iconTheme: {
                            primary: "#38a169", // Green-600
                            secondary: "#fff", // White
                        },
                        style: {
                            background: "#f0fff4", // Green-50
                            color: "#2f855a", // Green-700
                        },
                    },
                    error: {
                        icon: <TriangleAlertIcon className="h-4 w-4" />,
                        position: "top-right",
                        removeDelay: 500,
                        iconTheme: {
                            primary: "#e53e3e",
                            secondary: "#fff", // White
                        },
                        style: {
                            background: "#fff5f5", // Red-50
                            color: "#c53030", // Red-600
                        },
                    },
                }
            );
        } catch (error) {
            setIsLoading(false);
            toast.error(
                error instanceof Error ? error.message : "An unexpected error occurred"
            );
            router.refresh();
        }
    };

    // Early return if no session
    if (!session) {
        return null;
    }

    // Already completed task state
    if (isComplete) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className="bg-lime-600 text-teal-50"
                        variant="outline"
                        disabled>
                        Task Completed <GrCompliance className="h-4 w-4 ml-2 fill-lime-600" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <span>This task is already completed</span>
                </TooltipContent>
            </Tooltip>
        );
    }

    // Active task state
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    onClick={handleCompleteTask}
                    disabled={isLoading}
                    className="min-w-[140px]">
                    {isLoading ? (
                        <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Completing...
                        </>
                    ) : (
                        <>
                            <GrCompliance className="h-4 w-4 ml-2 fill-lime-600" />
                            Complete
                        </>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <span>Click to complete the task</span>
            </TooltipContent>
        </Tooltip>
    );
};

export default CompleteTaskBtn;
