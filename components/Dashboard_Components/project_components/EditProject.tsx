'use client'
import { Project, ProjectStatus } from '@/lib/generated/prisma'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

// UI Components
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon, Loader2, Save, TriangleAlertIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { UpdateProject } from '@/lib/actions/projects/update-project'

// Form schema validation
const projectSchema = z.object({
    name: z.string().min(3, {
        message: 'Project name must be at least 3 characters.',
    }),
    description: z.string().optional(),
    status: z.enum(["OPEN", "ONGOING", "COMPLETED", "CANCELLED", "ARCHIVED"], {
        required_error: 'Project status is required.',
    }),
    isPublic: z.boolean(),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
    dueDate: z.date().optional().nullable(),
    progress: z.coerce
        .number()
        .min(0)
        .max(100, {
            message: 'Progress must be between 0 and 100.',
        }),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const EditProject = ({ project }: { project: Project }) => {
    const router = useRouter()

    // Initialize the form with project data
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: project.name,
            description: project.description,
            status: project.status,
            isPublic: project.isPublic,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            dueDate: project.dueDate ? new Date(project.dueDate) : null,
            progress: project.progress
        },
    })

    // Handle form submission
    const onSubmit = async (values: ProjectFormValues) => {

        try {
            // const { message, success } = await UpdateProject(project.id, values)
            // if (!success) {
            //     toast.error(message || 'Failed to update project')
            //     return
            // }
            // toast.success(message || 'Project updated successfully')
            // router.push(`/dashboard/projects`)

            toast.promise(
                UpdateProject(project.id, values),
                {
                    loading: 'Updating project...',
                    success: ({ success, message }) => {
                        if (success) {
                            router.push(`/dashboard/projects`)
                            return message
                        } else {
                            throw new Error(message)
                        }
                    },
                    error: (error) => {
                        return error.message || 'Failed to update project'
                    },
                },
                {
                    position: 'top-right',
                    loading: {
                        icon: <Loader2 className="h-4 w-4 animate-spin" />,
                        position: 'top-right',
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#4a5568', // Gray-700
                            secondary: '#fff', // White
                        },
                        style: {
                            background: '#edf2f7', // Gray-100
                            color: '#2d3748', // Gray-800
                        },
                    },
                    success: {
                        icon: '✅',
                        position: 'top-right',
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#38a169', // Green-600
                            secondary: '#fff', // White
                        },
                        style: {
                            background: '#f0fff4', // Green-50
                            color: '#2f855a', // Green-700
                        },
                    },
                    error: {
                        icon: <TriangleAlertIcon className="h-4 w-4" />,
                        position: 'top-right',
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#e53e3e', // Red-600
                            secondary: '#fff', // White
                        },
                        style: {
                            background: '#fff5f5', // Red-50
                            color: '#c53030', // Red-700
                        },
                    },
                }
            )
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || 'An unexpected error occurred')
            }
            toast.error('Failed to update project')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Project Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter project name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Project Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the project (optional)"
                                                className="resize-none min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide details about the project goals and scope
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status, progress and Visibility */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Project Status */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue defaultValue={field.value} placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="OPEN">Open</SelectItem>
                                                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Current status :  {project.status}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Project Progress */}
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
                                                    min={project.progress}
                                                    max={100}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Current progress: {project.progress}%
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}

                                />

                                {/* Public/Private Toggle */}
                                <FormField
                                    control={form.control}
                                    name="isPublic"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Make Project Public</FormLabel>
                                                <FormDescription>
                                                    Allow other users to view this project
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Dates Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Start Date */}
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
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
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                When the project started
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                                                "w-full pl-3 text-left font-normal",
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
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                When the project should be completed
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* End Date */}
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
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
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                When the project was completed (if applicable)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4 pt-4">

                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
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
                                    disabled={form.formState.isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default EditProject