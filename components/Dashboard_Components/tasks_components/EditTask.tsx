'use client';
import { Project, Task, TaskPriority, TaskStatus } from '@/lib/generated/prisma';
import React, { use, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UpdateTask } from '@/lib/actions/tasks/update_Task';
// UI Components
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Loader2, Save, ClipboardEdit } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Form schema validation
const taskSchema = z.object({
    title: z.string().min(3, {
        message: 'Task title must be at least 3 characters.',
    }),
    description: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BACKLOG", "ARCHIVED", "CANCELLED"], {
        required_error: 'Task status is required.',
    }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
        required_error: 'Task priority is required.',
    }),
    dueDate: z.date().optional().nullable(),
    progress: z.coerce
        .number()
        .min(0)
        .max(100, {
            message: 'Progress must be between 0 and 100.',
        }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// Fixed interface with proper types
interface EditTaskProps {
    task: Task;
    projectPromise: Promise<{
        project: Project | null;
        message: string;
        status: number;
    }>
}

const EditTask = ({ task, projectPromise }: EditTaskProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize the form with task data
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task.title,
            description: task.description || '',
            status: task.status as TaskStatus, // Explicit cast to ensure type compatibility
            priority: task.priority as TaskPriority, // Explicit cast to ensure type compatibility
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            progress: task.progress || 0,
        },
    });

    // Handle form submission
    const onSubmit = async (values: TaskFormValues) => {
        setIsSubmitting(true);

        try {
            const taskData = {
                title: values.title,
                description: values.description || '',
                status: values.status as TaskStatus, // Ensure correct type
                priority: values.priority as TaskPriority, // Ensure correct type
                dueDate: values.dueDate as Date,
                progress: values.progress,
            }

            const { success, message } = await UpdateTask(task.id, taskData);
            if (success) {
                toast.success(message);
                setIsSubmitting(false);
                router.push(`/dashboard/tasks/${task.id}`);
            } else {
                toast.error(message);
            }
        } catch (error) {
            toast.error(error instanceof Error
                ? `Failed to update task: ${error.message}`
                : "An unexpected error occurred while updating the task");

        } finally {
            setIsSubmitting(false);
        }
    };


    const { project, message, status } = use(projectPromise);

    const projectDueDate = project?.dueDate
        ? new Date(project.dueDate)
        : null;

    // Add this helper function at the top of the file
    const isDateValid = (date: Date, projectDueDate?: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!date || date < today) {
            return false;
        }

        if (projectDueDate) {
            return date <= new Date(projectDueDate);
        }

        return true;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className='rounded-none'>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <ClipboardEdit className="h-5 w-5" />
                        {project && (
                            <p className="text-sm text-muted-foreground">
                                Editing task in project:
                                <Link
                                    href={`/dashboard/projects/${project.id}`}
                                    className="text-primary underline ml-1"
                                >
                                    {project.name}
                                </Link>
                            </p>
                        )}
                        {status !== 200 && (
                            <p className="text-sm text-red-500">
                                Error: {message}
                            </p>
                        )}
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Task Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter task title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Task Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the task in detail"
                                                className="resize-none min-h-[120px]"
                                                {...field}
                                                value={field.value || ''} // Fixed null handling
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide detailed information about what needs to be done
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status, Priority and Progress */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Task Status */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="TODO">To Do</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="REVIEW">Reviewing</SelectItem>
                                                    <SelectItem value="DONE">Completed</SelectItem>
                                                    <SelectItem value="BACKLOG">Backlog</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Current status: {task.status}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Task Priority */}
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select priority" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="LOW">Low</SelectItem>
                                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                                    <SelectItem value="HIGH">High</SelectItem>
                                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Current priority: {task.priority || 'None'}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Task Progress */}
                                <FormField
                                    control={form.control}
                                    name="progress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Progress</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0-100"
                                                    {...field}
                                                    min={0}
                                                    max={100}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Current progress: {task.progress || 0}%
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Due Date */}
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Due Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full md:w-auto pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    disabled={(date) =>
                                                        !isDateValid(date, projectDueDate as Date)
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Must be in future and before project due date
                                            {projectDueDate && (
                                                <span> (Project due date: {format(projectDueDate, 'PPP')})</span>
                                            )}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Project Information (read-only) */}
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <h3 className="text-sm font-medium mb-2">Task Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Project:</span>{' '}
                                        <span className="font-medium">{task.projectId || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Created by:</span>{' '}
                                        <span className="font-medium">{task.creatorId || 'Unknown'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Assigned to:</span>{' '}
                                        <span className="font-medium">{task.assigneeId || 'Unassigned'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Created on:</span>{' '}
                                        <span className="font-medium">
                                            {task.createdAt
                                                ? format(new Date(task.createdAt), 'PPP')
                                                : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
};


export default EditTask;