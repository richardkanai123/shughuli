'use client'
import { Button } from "@/components/ui/button"
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
import { Edit, Loader, Loader2 } from "lucide-react"
import { updateTaskProgress } from "@/lib/actions/tasks/updateTaskProgress"
import { useState } from "react"
import { useSession } from "@/lib/auth-client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"


const UpdateTaskProgressBtn = ({ taskId, currentProgress }: { taskId: string, currentProgress: number }) => {

    const [progress, setProgress] = useState(currentProgress)
    const [isUpdating, setIsUpdating] = useState(false)
    const { data: session, error, isPending } = useSession()
    const Router = useRouter()

    // This component would typically handle the state and logic for updating task progress.

    if (isPending) {
        return <div>Loading...</div>
    }

    if (error || !session) {
        return null
    }

    if (currentProgress === 100) {
        return null
    }



    const handleUpdateProgress = async () => {
        setIsUpdating(true)
        const { message, success } = await updateTaskProgress(taskId, progress, session.userId)
        if (!success) {
            toast.error(message)
            setIsUpdating(false)
            return
        }
        toast.success(message)
        Router.refresh()
        setIsUpdating(false)
    }


    if (isUpdating) {
        return (<Button disabled variant='outline' className="h-7 px-2">
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            <span className="text-xs">
                Updating...
            </span>
        </Button>)
    }



    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">
                        Update
                    </span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update Task Progress</AlertDialogTitle>
                    <AlertDialogDescription>
                        Choose the new progress percentage for this task.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    {/* Progress slider would go here */}
                    <div className="border rounded-md p-4 text-center text-muted-foreground">
                        <form action="">
                            <input type="range" min="0" max="100" value={progress} className="w-full" onChange={(e) => setProgress(Number(e.target.value))} />
                            <div className="w-full flex flex-col items-center justify-center mt-4">
                                <p className="mt-2 text-sm">
                                    Current Progress: {currentProgress}%
                                </p>
                                <p className="mt-2 text-sm">
                                    New Progress: {progress}%
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleUpdateProgress}>Update</AlertDialogAction>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UpdateTaskProgressBtn