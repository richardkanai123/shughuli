'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Lock, Unlock } from 'lucide-react'
import { changeVisibility } from '@/lib/actions/projects/change-visibility'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'

const ProjectVisibilityBtn = ({ isPublic, projectId }: { isPublic: boolean, projectId: string }) => {

    const Router = useRouter()

    const [isLoading, setIsLoading] = useState(false);


    const handleVisibilityChange = async () => {

        console.log('changing vs')
        try {
            setIsLoading
            if (!projectId) return;

            const { success, message, project } = await changeVisibility(projectId, !isPublic);
            if (!success) {
                // Handle error case
                toast.error(message || "Failed to change project visibility", {
                    duration: 3000,
                    position: "top-right",
                });
                setIsLoading(false);
                return;
            }

            toast.success(message || `Project: ${project?.name} is now ${project?.isPublic ? "private" : "public"}`, {
                duration: 3000,
                position: "top-right",
            });

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
                        <Button variant="outline" size="sm">
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