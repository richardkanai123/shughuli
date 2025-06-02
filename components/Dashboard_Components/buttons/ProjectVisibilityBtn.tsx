'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CheckCircle, Loader, Lock, TriangleAlertIcon, Unlock } from 'lucide-react'
import { changeVisibility } from '@/lib/actions/projects/change-visibility'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'

const ProjectVisibilityBtn = ({ isPublic, projectId }: { isPublic: boolean, projectId: string }) => {

    const Router = useRouter()

    const [isLoading, setIsLoading] = useState(false);


    const handleVisibilityChange = async () => {

        try {
            setIsLoading
            if (!projectId) return;

            toast.promise(
                changeVisibility(projectId, isPublic),
                {
                    loading: "Changing project visibility...",
                    success: (data) => {
                        return data.message || `Project visibility changed to ${data.project?.isPublic ? "public" : "private"}`;
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
                        <Button disabled={isLoading} variant="outline" size="sm">
                            {
                                isPublic ? "Privatise" : "Publicise"
                            }
                            {isPublic ? (
                                <Unlock className="h-4 w-4" />
                            ) : (
                                <Lock className="h-4 w-4" />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {isPublic ? "Make Project Private?" : "Make Project Public?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {isPublic
                                    ? "This will restrict access to only you."
                                    : "This will make the project visible to anyone with the link."}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleVisibilityChange} disabled={isLoading}>
                                {isPublic ? "Make Private" : "Make Public"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isPublic ? "Project is public" : "Project is private"}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default ProjectVisibilityBtn