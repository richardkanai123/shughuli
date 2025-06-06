"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion } from "framer-motion";
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
import { Calendar as CalendarIcon, Loader2, ListTodo } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createTask } from "@/lib/actions/tasks/create-tasks";
import toast from "react-hot-toast";

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

    return (
        <ErrorBoundary
            fallback={<div>Something went wrong. Please try again.</div>}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                        {/* Project Selection */}
                        <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.55 }}>
                                    <FormItem>
                                        <FormLabel>Project</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md">
                                                    <SelectValue placeholder="Select a project" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projects.length === 0 ? (
                                                    <SelectItem
                                                        value=""
                                                        disabled>
                                                        No projects available
                                                    </SelectItem>
                                                ) : (
                                                    projects.map((project) => (
                                                        <SelectItem
                                                            key={project.id}
                                                            value={project.id}
                                                            className="flex items-center gap-2">
                                                            <span className="font-medium">
                                                                {project.name}
                                                            </span>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-sm opacity-80">
                                            Currently selected project:{" "}
                                            {form.getValues("projectId")
                                                ? projects.find(
                                                    (project) =>
                                                        project.id === form.getValues("projectId")
                                                )?.slug
                                                : "None"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                </motion.div>
                            )}
                        />

                        {/* Task Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}>
                                    <FormItem className="transition-all duration-200 hover:translate-x-1">
                                        <FormLabel className="text-base font-semibold">
                                            Task Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter task title"
                                                {...field}
                                                autoFocus
                                                className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm opacity-80">
                                            Give your task a clear, descriptive title
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
                                    transition={{ delay: 0.2 }}>
                                    <FormItem className="transition-all duration-200 hover:translate-x-1">
                                        <FormLabel className="text-base font-semibold">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the task..."
                                                className="resize-none min-h-[100px] shadow-sm transition-all duration-200 hover:shadow focus:shadow-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm opacity-80">
                                            Provide detailed information about the task
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                </motion.div>
                            )}
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Due Date */}
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}>
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full pl-3 text-left font-normal shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]">
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            !isDateValid(date, selectedProject?.dueDate)
                                                        }
                                                        initialFocus
                                                        className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription className="text-sm opacity-80">
                                                {selectedProject
                                                    ? `Must be before project due date (${format(new Date(selectedProject.dueDate), "PPP")})`
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
                                        transition={{ delay: 0.4 }}>
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md">
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
                                            <FormMessage />
                                        </FormItem>
                                    </motion.div>
                                )}
                            />
                        </div>

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}>
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md">
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
                                        <FormMessage />
                                    </FormItem>
                                </motion.div>
                            )}
                        />

                        {form.formState.errors.root && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}>
                                <p className="text-sm text-rose-600 mt-2">
                                    Please select a priority and status
                                </p>
                            </motion.div>
                        )}
                        {/* Submit Button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}>
                            <Button
                                type="submit"
                                className=" shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:hover:scale-100"
                                disabled={
                                    form.formState.isSubmitting || !form.formState.isValid
                                }>
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <ListTodo className="h-4 w-4 mr-2" /> Create Task
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </ErrorBoundary>
    );
};

export default CreateTask;
