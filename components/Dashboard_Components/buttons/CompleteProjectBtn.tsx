'use client'
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
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader, TicketCheck, TriangleAlertIcon } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { completeProject } from "@/lib/actions/projects/complete-project"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"


const CompleteProjectBtn = ({ projectId }: { projectId: string }) => {

    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter()

    const handleCompleteProject = async () => {
        try {
            setIsLoading
            if (!projectId) return;

            toast.promise(
                completeProject(projectId),
                {
                    loading: "Completing Project",
                    success: ({ message, success }) => {
                        if (success) {
                            return message
                        }
                        else {
                            return message
                        }
                    },
                    error: (error) => {
                        return error.message || "Failed to change project visibility";
                    }
                },
                {
                    position: "top-right",
                    loading: {
                        icon: <Loader className="h-4 w-4 animate-spin" />,
                        position: "top-right",
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#4a5568', // Gray-700
                            secondary: '#fff', // White
                        },
                        style: {
                            background: '#edf2f7', // Gray-100
                            color: '#2d3748', // Gray-800
                        }

                    },
                    success: {
                        icon: <CheckCircle className="h-4 text-lime-400 w-4" />,
                        position: "top-right",
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#38a169', // Green-600
                            secondary: '#fff', // White
                        },
                        style: {
                            background: '#f0fff4', // Green-50
                            color: '#2f855a', // Green-700
                        }
                    },
                    error: {
                        icon: <TriangleAlertIcon className="h-4 w-4" />,
                        position: "top-right",
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#e53e3e',
                            secondary: '#fff', // White
                        },
                        style: {
                            background: '#fff5f5', // Red-50
                            color: '#c53030', // Red-600
                        }
                    }
                }
            )

            setIsLoading(false);
            Router.refresh(); // Refresh the page to reflect changes
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "An unexpected error occurred", {
                    duration: 3000,
                    position: "top-right",
                });
                Router.refresh(); // Refresh the page to reflect changes
                setIsLoading(false);
                return;
            }
            toast.error("An unexpected error occurred while changing visibility, please try again later.", {
                duration: 3000,
                position: "top-right",
            });
            setIsLoading(false);
        }
    }


    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-lime-500 hover:bg-lime-100 text-accent-foreground">
                            Complete <TicketCheck className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Complete Project
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to mark this project as completed? This action cannot be undone.
                                <br />
                                <br />
                                Once completed, the project will be archived and you will not be able to make further changes.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction disabled={isLoading} onClick={handleCompleteProject}>
                                Complete Project
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
                <p>Close project</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default CompleteProjectBtn