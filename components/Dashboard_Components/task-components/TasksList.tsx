'use client'

import { Task } from '@/lib/generated/prisma';
import { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    Filter,
    Search,
    XCircle,
} from "lucide-react";
import { format, isBefore, isToday } from "date-fns";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { use } from "react";
import { getStatusStyles } from '@/lib/TaskStatusStyle';
interface TasksListProps {
    tasks: Promise<{ tasks: Task[] | null; message: string; status: number }>;
    limit?: number;
}

export default function DashboardTasksList({ tasks, limit = 10 }: TasksListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<string>("dueDate");
    const [page, setPage] = useState(1);

    const tasksData = use(tasks);


    const getDueDateStatus = (dueDate: Date) => {
        const today = new Date();
        if (isToday(dueDate)) {
            return { className: "text-orange-500 font-medium", label: "Today" };
        } else if (isBefore(dueDate, today)) {
            return { className: "text-red-500 font-medium", label: "Overdue" };
        } else {
            return { className: "text-muted-foreground", label: format(dueDate, "MMM dd") };
        }
    };

    const filteredAndSortedTasks = useMemo(() => {
        if (!tasksData.tasks) return [];

        let filtered = [...tasksData.tasks];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(query) ||
                (task.description && task.description.toLowerCase().includes(query))
            );
        }



        // Apply status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "dueDate":
                    return new Date(a.dueDate as Date).getTime() - new Date(b.dueDate as Date).getTime();
                case "title":
                    return a.title.localeCompare(b.title);
                case "status":
                    return a.status.localeCompare(b.status);
                case "priority":
                    return (Number(b.priority) || 0) - (Number(a.priority) || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [tasksData.tasks, searchQuery, statusFilter, sortBy]);

    // Calculate pagination
    const pageSize = limit;
    const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize);
    const paginatedTasks = filteredAndSortedTasks.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handleCompleteTask = async (taskId: string, currentStatus: string) => {
        try {
            if (currentStatus === 'DONE') {
                toast.success("Task already completed");
                return;
            }

            console.log("Completing task:", taskId);

            toast.loading("Completing task...");

            // In a real implementation, you would refresh the tasks data here
        } catch (error) {
            toast.error(
                "An error occurred while completing the task. Please try again."
            );
        }
    };

    // Error handling
    if (tasksData.status !== 200) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>Your task list</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                    <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
                    <p className="text-muted-foreground">{tasksData.message}</p>
                </CardContent>
            </Card>
        );
    }


    // Empty state
    if (!tasksData.tasks || tasksData.tasks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>Your task list</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                    <CheckCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground">No tasks found</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                        You don't have any tasks yet
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard/tasks/create-new">Create a task</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Manage and track your tasks</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filters and Search */}
                <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                    <div className="flex items-center space-x-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <div className="flex items-center">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <span>Status</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All</SelectItem>
                                <SelectItem value="TODO">To Do</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="DONE">Done</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px]">
                                <div className="flex items-center">
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    <span>Sort by</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dueDate">Due Date</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                                <SelectItem value="priority">Priority</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-8 w-full md:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: 50 }}></TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead style={{ width: 80 }}></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={task.status === 'DONE'}
                                            onCheckedChange={() => handleCompleteTask(task.id, task.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{task.title}</div>
                                        {task.description && (
                                            <div className="text-xs text-muted-foreground line-clamp-1">
                                                {task.description}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusStyles(task.status)} variant="outline">
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                            <span
                                                className={
                                                    getDueDateStatus(new Date(task.dueDate as Date)).className
                                                }
                                            >
                                                {getDueDateStatus(new Date(task.dueDate as Date)).label}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/tasks/${task.id}`}>
                                                        View details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/tasks/${task.id}/edit`}>
                                                        Edit task
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleCompleteTask(task.id, task.status)}
                                                    disabled={task.status === 'DONE'}
                                                >
                                                    Mark as complete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page > 1 ? page - 1 : 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Button asChild>
                        <Link href="/dashboard/tasks/create-new">Create New Task</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}