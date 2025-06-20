'use client';
import { Project, Task, TaskPriority, TaskStatus } from '@/lib/generated/prisma';
import React, { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CalendarIcon,
    Loader2,
    Save,
    ClipboardEdit,
    ArrowLeft,
    AlertTriangle,
    Info,
    Target,
    Calendar as CalendarDays,
    User,
    Clock
} from 'lucide-react';
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
            status: task.status as TaskStatus,
            priority: task.priority as TaskPriority,
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
                status: values.status as TaskStatus,
                priority: values.priority as TaskPriority,
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

    const projectDueDate = project?.dueDate ? new Date(project.dueDate) : null;

    // Add this helper function
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto p-4"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="mb-6">
                <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ClipboardEdit className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold mb-2">Edit Task</CardTitle>
                                <CardDescription className="text-base">
                                    Update task details and track progress
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </div>

                        {/* Project Info */}
                        {project && (
                            <div className="mt-4 p-3 bg-background/60 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Project Context</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Editing task in project:{' '}
                                    <Link
                                        href={`/dashboard/projects/${project.id}`}
                                        className="text-primary font-medium underline hover:no-underline"
                                    >
                                        {project.name}
                                    </Link>
                                </p>
                            </div>
                        )}

                        {/* Error Alert */}
                        {status !== 200 && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Error loading project information: {message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Validation Errors */}
            {/* Main Form */}
            <motion.div variants={itemVariants}>
                <Card className="shadow-sm border-0 bg-card">
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Basic Information Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Info className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Basic Information</h3>
                                    </div>

                                    {/* Task Title */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Task Title *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter a clear, descriptive task title"
                                                        className="h-11"
                                                        {...field}
                                                    />
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
                                                <FormLabel className="text-sm font-medium">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Provide detailed information about what needs to be accomplished..."
                                                        className="resize-none min-h-[120px]"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Add context, requirements, or any important details about this task
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <Separator />

                                {/* Task Properties Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Target className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Task Properties</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Task Status */}
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">Status</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="TODO">📋 To Do</SelectItem>
                                                            <SelectItem value="IN_PROGRESS">🚀 In Progress</SelectItem>
                                                            <SelectItem value="REVIEW">👀 Review</SelectItem>
                                                            <SelectItem value="DONE">✅ Completed</SelectItem>
                                                            <SelectItem value="BACKLOG">📦 Backlog</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="flex items-center gap-1">
                                                        <span className="text-xs">Current:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {task.status.replace('_', ' ')}
                                                        </Badge>
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
                                                    <FormLabel className="text-sm font-medium">Priority</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select priority" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="LOW">🔵 Low</SelectItem>
                                                            <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                                                            <SelectItem value="HIGH">🟠 High</SelectItem>
                                                            <SelectItem value="URGENT">🔴 Urgent</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="flex items-center gap-1">
                                                        <span className="text-xs">Current:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {task.priority || 'None'}
                                                        </Badge>
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
                                                    <FormLabel className="text-sm font-medium">Progress (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0-100"
                                                            className="h-11"
                                                            {...field}
                                                            min={0}
                                                            max={100}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="flex items-center gap-1">
                                                        <span className="text-xs">Current:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {task.progress || 0}%
                                                        </Badge>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </motion.div>

                                <Separator />

                                {/* Due Date Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Timeline</h3>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col space-y-3">
                                                <FormLabel className="text-sm font-medium">Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full md:w-[280px] pl-3 text-left font-normal h-11",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a due date</span>
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
                                                <FormDescription className="space-y-1">
                                                    <p>Due date must be in the future</p>
                                                    {projectDueDate && (
                                                        <p className="text-xs text-amber-600 dark:text-amber-400">
                                                            📅 Project deadline: {format(projectDueDate, 'PPP')}
                                                        </p>
                                                    )}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <Separator />

                                {/* Task Information Section */}
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Task Metadata</h3>
                                    </div>

                                    <Card className="bg-muted/30 border-muted/50">
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Created by:</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {task.creatorId || 'Unknown'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Assigned to:</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {task.assigneeId || 'Unassigned'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Created on:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {task.createdAt
                                                                ? format(new Date(task.createdAt), 'MMM dd, yyyy')
                                                                : 'Unknown'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Project ID:</span>
                                                        <Badge variant="outline" className="text-xs font-mono">
                                                            {task.projectId?.slice(0, 8) || 'N/A'}...
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Form Actions */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t"
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                        className="sm:order-1"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="sm:order-2"
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitting ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center"
                                                >
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving Changes...
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="save"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </motion.div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default EditTask;