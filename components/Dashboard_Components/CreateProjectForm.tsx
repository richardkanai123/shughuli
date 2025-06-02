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

import {
    Calendar as CalendarIcon,
    Loader2,
    PlusIcon,
    AlertCircle
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
            // Set explicit dates with new Date() to ensure they're always valid Date objects
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            startDate: new Date(new Date().setHours(0, 0, 0, 0)), // Start date is today
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

    return (
        <ErrorBoundary fallback={
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-xl border border-red-200 bg-red-50 text-red-800"
            >
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p>Something went wrong. Please refresh and try again.</p>
                </div>
            </motion.div>
        }>
            <Form {...form}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 p-6 rounded-xl shadow-lg bg-card"
                    >
                        {/* Project Name */}
                        <motion.div
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Project Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter project name"
                                                {...field}
                                                autoFocus
                                                className="shadow-sm focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm opacity-80">
                                            Choose a unique name for your project
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your project..."
                                                className="resize-none min-h-[100px] shadow-sm focus:ring-2 focus:ring-primary/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm opacity-80">
                                            Brief description of your project goals and scope
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        {/* Dates */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Start Date */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-base font-semibold">Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal shadow-sm",
                                                                "transition-all duration-200",
                                                                "hover:shadow-md focus:ring-2 focus:ring-primary/20",
                                                                "active:scale-[0.98]"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'PPP')
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
                                                        selected={field.value instanceof Date && isValid(field.value) ? field.value : new Date()}
                                                        onSelect={(date) => {
                                                            // Ensure date is valid before setting
                                                            if (date && isValid(date)) {
                                                                field.onChange(date)

                                                                // If due date is before new start date, update due date
                                                                const currentDueDate = form.watch('dueDate')
                                                                if (date && currentDueDate && isBefore(currentDueDate, date)) {
                                                                    // Set due date to start date + 1 week
                                                                    const newDueDate = new Date(date)
                                                                    newDueDate.setDate(date.getDate() + 7)
                                                                    form.setValue('dueDate', newDueDate)
                                                                }
                                                            } else {
                                                                // Set to today if the selected date is invalid
                                                                field.onChange(new Date())
                                                            }
                                                        }}
                                                        disabled={(date) => !isStartDateValid(date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription className="text-sm opacity-80">
                                                When does your project start?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Due Date */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-base font-semibold">Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal shadow-sm",
                                                                "transition-all duration-200",
                                                                "hover:shadow-md focus:ring-2 focus:ring-primary/20",
                                                                "active:scale-[0.98]"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'PPP')
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
                                                        selected={field.value instanceof Date && isValid(field.value) ? field.value : new Date()}
                                                        onSelect={field.onChange}
                                                        disabled={dueDateDisabled}
                                                        initialFocus
                                                        fromDate={startDate}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription className="text-sm opacity-80">
                                                When is your project due? (Must be after start date)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        </div>

                        {/* Status */}
                        <motion.div
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Project Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="shadow-sm focus:ring-2 focus:ring-primary/20">
                                                    <SelectValue placeholder="Select project status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="shadow-lg">
                                                <SelectItem value="OPEN">Open</SelectItem>
                                                <SelectItem value="ONGOING">Ongoing</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        {/* Public Toggle */}
                        <motion.div
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-semibold">Public Project</FormLabel>
                                            <FormDescription className="text-sm opacity-80">
                                                Make this project visible to everyone
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </motion.div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        {/* Error message */}
                        <AnimatePresence>
                            {form.formState.errors.root && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3 rounded-md w-full bg-red-50 border border-red-200"
                                >
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        <p className="text-sm font-medium">{form.formState.errors.root.message}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.div
                            whileHover={{ scale: form.formState.isSubmitting ? 1 : 1.01 }}
                            whileTap={{ scale: form.formState.isSubmitting ? 1 : 0.98 }}
                        >
                            <Button
                                type="submit"
                                className="w-full shadow-md"
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                            >
                                {form.formState.isSubmitting ? (
                                    <motion.div
                                        className="flex items-center justify-center gap-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                        <span>Creating...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="flex items-center justify-center gap-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                        <span>Create Project</span>
                                    </motion.div>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </Form>
        </ErrorBoundary>
    )
}

export default CreateProjectForm
