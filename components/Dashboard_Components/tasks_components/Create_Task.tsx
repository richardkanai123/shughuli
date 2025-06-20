"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { format, isWithinInterval } from "date-fns";
import { newTaskSchema } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar as CalendarIcon,
    Loader2,
    ListTodo,
    FileText,
    Settings,
    Clock,
    Flag,
    CheckSquare,
    AlertCircle,
    FolderOpen
} from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createTask } from "@/lib/actions/tasks/create-tasks";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

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

interface projectProps {
    id: string;
    name: string;
    slug: string;
    dueDate: Date;
}

const CreateTask = ({ projects }: { projects: projectProps[] }) => {
    const Router = useRouter();
    const searchParams = useSearchParams();
    const targetProjectid = searchParams.get("project");
    const targetProject = projects.find(
        (project) =>
            project.slug === targetProjectid || project.id === targetProjectid
    )?.id;
    const targetProjectDueDate = projects.find(
        (project) =>
            project.slug === targetProjectid || project.id === targetProjectid
    )?.dueDate;

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            dueDate: targetProjectDueDate,
            priority: "MEDIUM",
            status: "TODO",
            projectId: targetProject || "",
        },
        resolver: zodResolver(newTaskSchema),
        mode: "onChange",
    });

    // Add this to watch for project changes
    const selectedProjectId = form.watch("projectId");
    const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
    );

    const onSubmit: SubmitHandler<z.infer<typeof newTaskSchema>> = async (
        values
    ) => {
        // check due date
        const isValidDueDate = isWithinInterval(new Date(values.dueDate), {
            start: new Date(),
            end: new Date(values.dueDate),
        });
        if (!isValidDueDate) {
            form.setError("dueDate", {
                message: targetProjectDueDate
                    ? `Due date must be in the future and before the project due date of ${format(targetProjectDueDate, "yyyy-MM-dd")}.`
                    : "Due date must be in the future.",
            });
            return;
        }

        const { data, message, success } = await createTask(values);
        if (!success) {
            form.setError("root", { message: message as string });
            toast.error(message);
            return;
        }

        toast.success(message as string);
        form.reset();
        Router.push("/dashboard/tasks/success");
    };

    // Priority color mapping
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW": return "bg-blue-500";
            case "MEDIUM": return "bg-yellow-500";
            case "HIGH": return "bg-orange-500";
            case "URGENT": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    // Status color mapping
    const getStatusColor = (status: string) => {
        switch (status) {
            case "TODO": return "bg-gray-500";
            case "IN_PROGRESS": return "bg-blue-500";
            case "REVIEW": return "bg-purple-500";
            case "DONE": return "bg-green-500";
            case "BACKLOG": return "bg-orange-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <ErrorBoundary
            fallback={
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-lg border border-destructive/50 bg-destructive/10"
                >
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p className="font-medium">Something went wrong. Please refresh and try again.</p>
                    </div>
                </motion.div>
            }
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto"
            >
                <Card className="shadow-lg border-0 bg-card">
                    <CardHeader className="space-y-1 pb-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ListTodo className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Create New Task</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Add a new task to your project and track its progress
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Project Selection Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FolderOpen className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Project Assignment</h3>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="projectId"
                                        render={({ field }) => (
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        Project
                                                        <Badge variant="secondary" className="text-xs">Required</Badge>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select a project for this task" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {projects.length === 0 ? (
                                                                <SelectItem value="" disabled>
                                                                    No projects available
                                                                </SelectItem>
                                                            ) : (
                                                                projects.map((project) => (
                                                                    <SelectItem
                                                                        key={project.id}
                                                                        value={project.id}
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <FolderOpen className="h-4 w-4 text-primary" />
                                                                            <span className="font-medium">
                                                                                {project.name}
                                                                            </span>
                                                                            <Badge variant="outline" className="text-xs">
                                                                                Due: {format(new Date(project.dueDate), "MMM dd")}
                                                                            </Badge>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        {selectedProject ? (
                                                            <span className="flex items-center gap-2">
                                                                <CheckSquare className="h-3 w-3 text-green-500" />
                                                                Selected: {selectedProject.name} • Due: {format(new Date(selectedProject.dueDate), "PPP")}
                                                            </span>
                                                        ) : (
                                                            "Choose which project this task belongs to"
                                                        )}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </motion.div>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Basic Information Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Task Details</h3>
                                    </div>

                                    {/* Task Title */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        Task Title
                                                        <Badge variant="secondary" className="text-xs">Required</Badge>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g., Design user authentication flow"
                                                            {...field}
                                                            autoFocus
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Give your task a clear, descriptive title that explains what needs to be done
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </motion.div>
                                        )}
                                    />

                                    {/* Description */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Provide detailed requirements, acceptance criteria, or any relevant information..."
                                                            className="resize-none min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Include requirements, acceptance criteria, and any relevant context
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            </motion.div>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Settings Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Task Configuration</h3>
                                    </div>

                                    <div className="grid gap-6 lg:grid-cols-3">
                                        {/* Due Date */}
                                        <FormField
                                            control={form.control}
                                            name="dueDate"
                                            render={({ field }) => (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            Due Date
                                                            <Badge variant="secondary" className="text-xs">Required</Badge>
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal h-11",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {field.value ? (
                                                                            format(field.value, "PPP")
                                                                        ) : (
                                                                            <span>Select date</span>
                                                                        )}
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    disabled={(date) =>
                                                                        !isDateValid(date, selectedProject?.dueDate)
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription className="text-xs">
                                                            {selectedProject
                                                                ? `Must be before ${format(new Date(selectedProject.dueDate), "MMM dd, yyyy")}`
                                                                : "Select a project first"}
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                </motion.div>
                                            )}
                                        />

                                        {/* Priority */}
                                        <FormField
                                            control={form.control}
                                            name="priority"
                                            render={({ field }) => (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                            <Flag className="h-4 w-4" />
                                                            Priority
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-11">
                                                                    <SelectValue placeholder="Select priority level" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="LOW">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor("LOW"))}></div>
                                                                        Low Priority
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="MEDIUM">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor("MEDIUM"))}></div>
                                                                        Medium Priority
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="HIGH">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor("HIGH"))}></div>
                                                                        High Priority
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="URGENT">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor("URGENT"))}></div>
                                                                        Urgent
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription className="text-xs">
                                                            How important is this task?
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                </motion.div>
                                            )}
                                        />

                                        {/* Status */}
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                >
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                            <CheckSquare className="h-4 w-4" />
                                                            Initial Status
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-11">
                                                                    <SelectValue placeholder="Select initial status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="TODO">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getStatusColor("TODO"))}></div>
                                                                        To Do
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="IN_PROGRESS">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getStatusColor("IN_PROGRESS"))}></div>
                                                                        In Progress
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="REVIEW">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getStatusColor("REVIEW"))}></div>
                                                                        Review
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="DONE">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getStatusColor("DONE"))}></div>
                                                                        Completed
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="BACKLOG">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={cn("w-2 h-2 rounded-full", getStatusColor("BACKLOG"))}></div>
                                                                        Backlog
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription className="text-xs">
                                                            Current state of the task
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                </motion.div>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Error Display */}
                                <AnimatePresence>
                                    {form.formState.errors.root && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                                        >
                                            <div className="flex items-center gap-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <p className="text-sm font-medium">{form.formState.errors.root.message}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => Router.back()}
                                        className="h-11 px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Button
                                            type="submit"
                                            className="h-11 px-6 min-w-[140px]"
                                            disabled={
                                                form.formState.isSubmitting || !form.formState.isValid
                                            }
                                        >
                                            {form.formState.isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Creating...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <ListTodo className="h-4 w-4" />
                                                    <span>Create Task</span>
                                                </div>
                                            )}
                                        </Button>
                                    </motion.div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </ErrorBoundary>
    );
};

export default CreateTask;