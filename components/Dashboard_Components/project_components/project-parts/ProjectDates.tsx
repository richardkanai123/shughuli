'use client'
import { Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, isAfter } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useMemo } from "react"
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

interface ProjectDatesProps {
    startDate?: Date | string | null
    endDate?: Date | string | null
    projectId: string
}

const ProjectDates = ({ startDate, endDate, projectId }: ProjectDatesProps) => {
    const isOverdue = useMemo(() => {
        if (!endDate) return false;
        return isAfter(new Date(), new Date(endDate));
    }, [endDate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Start Date</span>
                    </div>

                    {/* Set Start Date Button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Set</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Set Start Date</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Choose a start date for this project.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                {/* Date picker would go here */}
                                <div className="border rounded-md p-4 text-center text-muted-foreground">
                                    Date Picker Placeholder
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Save</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <p className="text-sm font-medium">
                    {startDate ? format(new Date(startDate), 'PPP') : 'Not set'}
                </p>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">End Date</span>
                    </div>

                    {/* Set End Date Button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Set</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Set End Date</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Choose a target completion date for this project.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                {/* Date picker would go here */}
                                <div className="border rounded-md p-4 text-center text-muted-foreground">
                                    Date Picker Placeholder
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Save</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <p className={cn(
                    "text-sm font-medium",
                    isOverdue && "text-red-500"
                )}>
                    {endDate ? format(new Date(endDate), 'PPP') : 'Not set'}
                </p>
            </div>
        </motion.div>
    )
}

export default ProjectDates