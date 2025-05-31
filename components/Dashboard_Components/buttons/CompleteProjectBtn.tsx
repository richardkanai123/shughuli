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
import { TicketCheck } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const CompleteProjectBtn = ({ projectId }: { projectId: string }) => {
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
                            <AlertDialogAction>
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