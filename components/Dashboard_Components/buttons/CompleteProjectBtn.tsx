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
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { completeProject } from "@/lib/actions/projects/complete-project"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const CompleteProjectBtn = ({ projectId }: { projectId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter()

    const handleCompleteProject = async () => {
        try {
            setIsLoading(true);
            if (!projectId) return;

            const result = await completeProject(projectId);

            if (result.success) {
                toast.success(result.message || "Project completed successfully");
                Router.refresh();
            } else {
                toast.error(result.message || "Failed to complete project");
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="default"
                            size="sm"
                            className="h-9 bg-green-600 hover:bg-green-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            Complete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <AlertDialogTitle>Complete Project</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="space-y-3">
                                <p>Are you sure you want to mark this project as completed?</p>

                                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-amber-700 dark:text-amber-300">
                                            <p className="font-medium mb-1">Important:</p>
                                            <p>Once completed, the project will be archived and you won't be able to make further changes.</p>
                                        </div>
                                    </div>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={isLoading}
                                onClick={handleCompleteProject}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Completing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Complete Project
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>Mark project as completed</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default CompleteProjectBtn