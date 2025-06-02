import { Task } from "@/lib/generated/prisma";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { useMemo } from "react";

export default function TaskUrgentAlert({ tasks }: { tasks: Task[] }) {
    // Memoize the most urgent task calculation
    const overdueOrUrgentTask = useMemo(() => {
        return tasks
            .filter(task => task.status !== 'DONE' && task.status !== 'BACKLOG')
            .sort((a, b) => new Date(a.dueDate as Date).getTime() - new Date(b.dueDate as Date).getTime())[0];
    }, [tasks]);

    if (!overdueOrUrgentTask) return null;

    const isOverdue = new Date(overdueOrUrgentTask.dueDate as Date) < new Date();

    return (
        <div className={cn(
            "p-3 rounded-md mb-6",
            isOverdue
                ? "bg-destructive/10 border border-destructive/20"
                : "bg-orange-500/10 border border-orange-500/20"
        )}>
            <div className="flex items-start gap-2">
                <div className={cn(
                    "mt-0.5",
                    isOverdue
                        ? "text-destructive"
                        : "text-orange-500"
                )}>
                    <Clock className="h-4 w-4" />
                </div>
                <div>
                    <div className="font-medium text-sm">
                        {isOverdue ? "Overdue Task" : "Most Urgent Task"}
                    </div>
                    <div className="text-sm truncate">{overdueOrUrgentTask.title}</div>
                    <div className="text-xs mt-1">
                        Due {formatDistanceToNowStrict(new Date(overdueOrUrgentTask.dueDate as Date), { addSuffix: true })}
                    </div>
                </div>
            </div>
        </div>
    );
}