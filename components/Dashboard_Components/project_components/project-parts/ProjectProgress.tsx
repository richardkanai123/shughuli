'use client'
import { BarChart4, CheckCircle2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow, isAfter } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo } from "react"

interface ProjectProgressProps {
    progressValue: number
    status: string
    startDate?: Date | string | null
    endDate?: Date | string | null
}

const ProjectProgress = ({ progressValue, status, startDate, endDate }: ProjectProgressProps) => {
    // Calculate days remaining
    const daysRemaining = useMemo(() => {
        if (!endDate) return null;
        return Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    }, [endDate]);

    const isOverdue = useMemo(() => {
        if (!endDate) return false;
        return isAfter(new Date(), new Date(endDate));
    }, [endDate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart4 className="h-4 w-4" />
                    Progress
                </div>
                <span className="text-sm font-medium">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />

            {/* Completion estimate */}
            <div className="flex justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                    {status === 'COMPLETED' ? (
                        <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Completed</span>
                        </div>
                    ) : daysRemaining ? (
                        <AnimatePresence>
                            {isOverdue ? (
                                <motion.div
                                    key="overdue"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-1 text-red-500"
                                >
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span>Overdue by {Math.abs(daysRemaining)} days</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="remaining"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <span>{daysRemaining} days remaining</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        <span>No deadline set</span>
                    )}
                </div>
                <div className="text-xs text-muted-foreground">
                    {startDate && "Started " + formatDistanceToNow(new Date(startDate), { addSuffix: true })}
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectProgress