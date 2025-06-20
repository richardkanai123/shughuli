'use client'
import { Project, ProjectStatus } from '@/lib/generated/prisma'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    CalendarIcon,
    Loader2,
    Save,
    TriangleAlertIcon,
    FolderEdit,
    ArrowLeft,
    Info,
    Settings,
    Calendar as CalendarDays,
    BarChart3,
    Globe,
    Lock,
    Play,
    Target,
    Clock
} from 'lucide-react'
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
                            primary: '#4a5568',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#edf2f7',
                            color: '#2d3748',
                        },
                    },
                    success: {
                        icon: '✅',
                        position: 'top-right',
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#38a169',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#f0fff4',
                            color: '#2f855a',
                        },
                    },
                    error: {
                        icon: <TriangleAlertIcon className="h-4 w-4" />,
                        position: 'top-right',
                        removeDelay: 500,
                        iconTheme: {
                            primary: '#e53e3e',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#fff5f5',
                            color: '#c53030',
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
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto p-4"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="mb-6">
                <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FolderEdit className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold mb-2">Edit Project</CardTitle>
                                    <CardDescription className="text-base">
                                        Update project settings and track progress
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.back()}
                                disabled={form.formState.isSubmitting}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </div>

                        {/* Project Status Badge */}
                        <div className="mt-4 p-3 bg-background/60 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Target className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Current Project</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        {project.progress || 0}% Complete
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Editing: <span className="font-medium text-foreground">{project.name}</span>
                            </p>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

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

                                    {/* Project Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Project Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter a clear, descriptive project name"
                                                        className="h-11"
                                                        {...field}
                                                    />
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
                                                <FormLabel className="text-sm font-medium">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe the project goals, scope, and key objectives..."
                                                        className="resize-none min-h-[120px]"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Provide details about the project goals and scope
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <Separator />

                                {/* Project Configuration Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Project Configuration</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Project Status */}
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">Status</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="OPEN">📝 Open</SelectItem>
                                                            <SelectItem value="ONGOING">🚀 Ongoing</SelectItem>
                                                            <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                                                            <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                                                            <SelectItem value="ARCHIVED">📦 Archived</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="flex items-center gap-1">
                                                        <span className="text-xs">Current:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {project.status.replace('_', ' ')}
                                                        </Badge>
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
                                                    <FormLabel className="text-sm font-medium">Progress (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0-100"
                                                            className="h-11"
                                                            {...field}
                                                            min={project.progress}
                                                            max={100}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="flex items-center gap-1">
                                                        <span className="text-xs">Current:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {project.progress || 0}%
                                                        </Badge>
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Visibility Settings */}
                                    <FormField
                                        control={form.control}
                                        name="isPublic"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Card className="bg-muted/30 border-muted/50">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start space-x-3">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    className="mt-1"
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-2 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    {field.value ? (
                                                                        <Globe className="h-4 w-4 text-green-600" />
                                                                    ) : (
                                                                        <Lock className="h-4 w-4 text-amber-600" />
                                                                    )}
                                                                    <FormLabel className="text-sm font-medium">
                                                                        Make Project Public
                                                                    </FormLabel>
                                                                    <Badge
                                                                        variant={field.value ? "default" : "secondary"}
                                                                        className="text-xs"
                                                                    >
                                                                        {field.value ? "Public" : "Private"}
                                                                    </Badge>
                                                                </div>
                                                                <FormDescription>
                                                                    {field.value
                                                                        ? "Other users can view and discover this project"
                                                                        : "Only you and invited members can access this project"}
                                                                </FormDescription>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <Separator />

                                {/* Timeline Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Project Timeline</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Start Date */}
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col space-y-3">
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Play className="h-3.5 w-3.5 text-green-600" />
                                                        Start Date
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
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick start date</span>
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
                                                        When the project started or will start
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
                                                <FormItem className="flex flex-col space-y-3">
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Target className="h-3.5 w-3.5 text-amber-600" />
                                                        Due Date
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
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick due date</span>
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
                                                        Target completion deadline
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
                                                <FormItem className="flex flex-col space-y-3">
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                                                        End Date
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
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick end date</span>
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
                                                        Actual completion date (if finished)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </motion.div>

                                <Separator />

                                {/* Project Metadata */}
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-semibold">Project Metadata</h3>
                                    </div>

                                    <Card className="bg-muted/30 border-muted/50">
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Project ID:</span>
                                                        <Badge variant="outline" className="text-xs font-mono">
                                                            {project.id.slice(0, 8)}...
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Owner:</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {project.ownerId?.slice(0, 8) || 'Unknown'}...
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Created:</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {project.createdAt
                                                                ? format(new Date(project.createdAt), 'MMM dd, yyyy')
                                                                : 'Unknown'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Visibility:</span>
                                                        <Badge
                                                            variant={project.isPublic ? "default" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {project.isPublic ? "Public" : "Private"}
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
                                        disabled={form.formState.isSubmitting}
                                        className="sm:order-1"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                        className="sm:order-2"
                                    >
                                        <AnimatePresence mode="wait">
                                            {form.formState.isSubmitting ? (
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
    )
}

export default EditProject