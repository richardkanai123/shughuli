import { Circle, HourglassIcon, CheckCircle, AlertTriangle } from "lucide-react";
import { TaskStatusCounts } from "./taskUtils";

interface TaskStatusSummaryProps {
    statusCounts: TaskStatusCounts;
    overdueTasks: number;
}

export default function TaskStatusSummary({ statusCounts, overdueTasks }: TaskStatusSummaryProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Circle className="h-3 w-3 mr-1 fill-blue-500 text-blue-500" />
                    To Do
                </div>
                <span className="text-2xl font-semibold">{statusCounts.TODO}</span>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm text-muted-foreground">
                    <HourglassIcon className="h-3 w-3 mr-1 text-orange-500" />
                    In Progress
                </div>
                <span className="text-2xl font-semibold">{statusCounts.IN_PROGRESS}</span>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    Done
                </div>
                <span className="text-2xl font-semibold">{statusCounts.DONE}</span>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 mr-1 text-destructive" />
                    Overdue
                </div>
                <span className="text-2xl font-semibold">{overdueTasks}</span>
            </div>
        </div>
    );
}