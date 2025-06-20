'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { format, isBefore, isValid } from 'date-fns'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

import {
    NewProjectSchemaType,
    newProjectSchema,
} from '@/lib/validation/schemas'

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
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import {
    Calendar as CalendarIcon,
    Loader2,
    PlusIcon,
    AlertCircle,
    Globe,
    Lock,
    FolderPlus,
    Settings,
    FileText,
    Clock
} from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { createProject } from '@/lib/actions/projects/create-project'
import { cn } from '@/lib/utils'

// Enhanced date validation
const isStartDateValid = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return isValid(date) && !isBefore(date, today)
}

const isDueDateValid = (date: Date, startDate: Date) => {
    return isValid(date) && isValid(startDate) && !isBefore(date, startDate)
}

const CreateProjectForm = ({ userId }: { userId: string }) => {
    const router = useRouter()

    const form = useForm<NewProjectSchemaType>({
        defaultValues: {
            name: '',
            description: '',
            isPublic: true,
            status: 'OPEN',
            slug: '',
            ownerId: userId,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        resolver: zodResolver(newProjectSchema),
        mode: 'onChange',
    })

    const onSubmit: SubmitHandler<NewProjectSchemaType> = async (values) => {
        try {
            // Validate that startDate exists and is a valid date
            if (!values.startDate || !isValid(values.startDate)) {
                form.setError('startDate', {
                    type: 'manual',
                    message: 'Start date is required and must be a valid date'
                })
                return
            }

            // Validate that dueDate exists and is a valid date
            if (!values.dueDate || !isValid(values.dueDate)) {
                form.setError('dueDate', {
                    type: 'manual',
                    message: 'Due date is required and must be a valid date'
                })
                return
            }

            // Ensure due date is after start date
            if (isBefore(values.dueDate, values.startDate)) {
                form.setError('dueDate', {
                    type: 'manual',
                    message: 'Due date must be after start date'
                })
                return
            }

            // Generate slug from name with timestamp for uniqueness
            const slug = values.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-') + '-' + Date.now().toString()

            const projectData = {
                name: values.name,
                description: values.description,
                isPublic: values.isPublic,
                status: values.status,
                slug,
                ownerId: values.ownerId,
                dueDate: values.dueDate,
                startDate: values.startDate,
            }

            const { data, message, status } = await createProject({
                name: projectData.name,
                description: projectData.description,
                isPublic: projectData.isPublic,
                status: projectData.status,
                slug: projectData.slug,
                ownerId: projectData.ownerId,
                dueDate: projectData.dueDate,
                startDate: projectData.startDate
            })

            if (status !== 201) {
                toast.error(message)
                form.setError('root', { message })
                return
            }

            toast.success(data || message)
            form.reset()
            router.push('/dashboard/projects/success')
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        }
    }

    const startDate = form.watch('startDate')
    const dueDateDisabled = (date: Date) => !isDueDateValid(date, startDate as Date)
    const isPublic = form.watch('isPublic')

    return (
        <ErrorBoundary fallback={
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
        }>
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
                                <FolderPlus className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Set up your project details and start managing your tasks
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Basic Information Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Basic Information</h3>
                                    </div>

                                    {/* Project Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                    Project Name
                                                    <Badge variant="secondary" className="text-xs">Required</Badge>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Website Redesign, Mobile App Development"
                                                        {...field}
                                                        autoFocus
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Choose a descriptive name that clearly identifies your project
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Description */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe your project goals, scope, and key objectives..."
                                                        className="resize-none min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Provide context about your project to help team members understand its purpose
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Timeline Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Project Timeline</h3>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Start Date */}
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                        Start Date
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
                                                                        format(field.value, 'PPP')
                                                                    ) : (
                                                                        <span>Select start date</span>
                                                                    )}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value instanceof Date && isValid(field.value) ? field.value : new Date()}
                                                                onSelect={(date) => {
                                                                    if (date && isValid(date)) {
                                                                        field.onChange(date)
                                                                        const currentDueDate = form.watch('dueDate')
                                                                        if (date && currentDueDate && isBefore(currentDueDate, date)) {
                                                                            const newDueDate = new Date(date)
                                                                            newDueDate.setDate(date.getDate() + 7)
                                                                            form.setValue('dueDate', newDueDate)
                                                                        }
                                                                    } else {
                                                                        field.onChange(new Date())
                                                                    }
                                                                }}
                                                                disabled={(date) => !isStartDateValid(date)}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        When will you begin working on this project?
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
                                                    <FormLabel className="text-sm font-medium flex items-center gap-2">
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
                                                                        format(field.value, 'PPP')
                                                                    ) : (
                                                                        <span>Select due date</span>
                                                                    )}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value instanceof Date && isValid(field.value) ? field.value : new Date()}
                                                                onSelect={field.onChange}
                                                                disabled={dueDateDisabled}
                                                                initialFocus
                                                                fromDate={startDate}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        Target completion date (must be after start date)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Settings Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Project Settings</h3>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Status */}
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">Initial Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select project status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="OPEN">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                    Open
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ONGOING">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                                    Ongoing
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="COMPLETED">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                    Completed
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ARCHIVED">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                                                    Archived
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="CANCELLED">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                                    Cancelled
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        You can change this later in project settings
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Public Toggle */}
                                        <FormField
                                            control={form.control}
                                            name="isPublic"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">Visibility</FormLabel>
                                                    <Card className={cn(
                                                        "transition-colors duration-200",
                                                        isPublic ? "border-primary/20 bg-primary/5" : "border-muted-foreground/20"
                                                    )}>
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    {isPublic ? (
                                                                        <Globe className="h-5 w-5 text-primary" />
                                                                    ) : (
                                                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                                                    )}
                                                                    <div>
                                                                        <p className="text-sm font-medium">
                                                                            {isPublic ? 'Public Project' : 'Private Project'}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {isPublic
                                                                                ? 'Visible to everyone in your organization'
                                                                                : 'Only visible to project members'
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <FormControl>
                                                                    <Switch
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Error message */}
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
                                        onClick={() => router.back()}
                                        className="h-11 px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-11 px-6 min-w-[140px]"
                                        disabled={form.formState.isSubmitting || !form.formState.isValid}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Creating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <PlusIcon className="h-4 w-4" />
                                                <span>Create Project</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </ErrorBoundary>
    )
}

export default CreateProjectForm