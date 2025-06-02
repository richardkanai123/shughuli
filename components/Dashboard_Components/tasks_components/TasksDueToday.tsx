'use client'
import { Task } from '@/lib/generated/prisma';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TasksDueToday({ tasks }: { tasks: Task[] }) {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 550);

        return () => clearTimeout(timer);
    }, []);

    // Get tasks due today
    const tasksDueToday = useMemo(() => {
        return tasks.filter(task => {
            // Only include non-completed tasks
            if (task.status === 'DONE') return false;

            // Check if due date is today
            return isToday(new Date(task.dueDate as Date));
        }).sort((a, b) => {
            // Sort by priority if available, otherwise by name
            if (a.priority !== null && a.priority !== undefined &&
                b.priority !== null && b.priority !== undefined) {
                return Number(b.priority) - Number(a.priority); // Higher priority first
            }
            return a.title.localeCompare(b.title);
        }).slice(0, 3); // Show max 3 tasks
    }, [tasks]);

    if (isLoading) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-2" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }

    if (tasksDueToday.length === 0) {
        return null
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Due Today</span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {tasksDueToday.length} task{tasksDueToday.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="space-y-2">
                {tasksDueToday.map(task => (
                    <div
                        key={task.id}
                        className="p-3 border rounded-md bg-primary/5 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                task.status === 'IN_PROGRESS'
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                            )} />
                            <span className="text-sm font-medium line-clamp-1">
                                {task.title}
                            </span>
                        </div>
                        <Link href={`/dashboard/tasks/${task.id}`} passHref>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                <span className="text-xs">Complete</span>
                            </Button>
                        </Link>
                    </div>
                ))}
                {tasksDueToday.length > 3 && (
                    <Link href="/dashboard/tasks?dueToday=true" passHref className="block text-center">
                        <Button variant="link" size="sm">
                            View all {tasksDueToday.length} tasks due today
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}