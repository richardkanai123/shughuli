'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

import {
    NewProjectSchemaType,
    newProjectSchema,
} from '@/lib/validation/schemas'

import { cn } from '@/lib/utils'

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

import { Calendar as CalendarIcon, PlusIcon } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import LoadingSpinner from '../Public_Components/Loaders/LoadSpinner'
import { Textarea } from '../ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Switch } from '../ui/switch'

const isDateValid = (date: Date, startDate?: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return startDate ? date >= startDate : date >= today
}

const CreateProjectForm = ({ userId }: { userId: string }) => {
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            name: '',
            description: '',
            startDate: undefined,
            endDate: undefined,
            isPublic: true,
            status: 'OPEN',
            slug: '',
            ownerId: userId,
        },
        resolver: zodResolver(newProjectSchema),
        mode: 'onChange',
    })

    const { isSubmitting } = form.formState

    useEffect(() => {
        const now = new Date()
        form.setValue('startDate', now)
        form.setValue('endDate', now)
    }, [])

    const onSubmit: SubmitHandler<NewProjectSchemaType> = async (values) => {
        const slug = values.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')

        const projectData = { ...values, slug }

        try {
            console.log(projectData)
            // const response = await toast.promise(
            //     fetch('/api/projects/create', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(projectData),
            //     }),
            //     {
            //         loading: 'Creating your project...',
            //         success: 'Project created successfully! Redirecting...',
            //         error: (err) =>
            //             err instanceof Error
            //                 ? err.message
            //                 : 'Failed to create project',
            //     }
            // )

            // const data = await response.json()

            // if (!response.ok) throw new Error(data.message)

            // form.reset()
            // router.refresh()
            // router.push(`/projects/${data.project.id}`)
        } catch (error) {
            // Error already handled by toast
            console.log(error)
        }
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 rounded-xl   shadow-lg transition-all duration-200 hover:shadow-xl">
                    {/* Project Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-200 hover:translate-x-1">
                                <FormLabel className="text-base font-semibold">Project Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter project name"
                                        {...field}
                                        autoFocus
                                        className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md"
                                    />
                                </FormControl>
                                <FormDescription className="text-sm opacity-80">Choose a unique name for your project</FormDescription>
                                <FormMessage className="text-sm font-medium" />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-200 hover:translate-x-1">
                                <FormLabel className="text-base font-semibold">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your project..."
                                        className="resize-none min-h-[100px] shadow-sm transition-all duration-200 hover:shadow focus:shadow-md"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-sm opacity-80">Brief description of your project goals and scope</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Dates */}
                    <div className="grid gap-6 md:grid-cols-2">
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
                                                    variant="outline"
                                                    className="w-full pl-3 text-left font-normal shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                                                >
                                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => !isDateValid(date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                                                    variant="outline"
                                                    className="w-full pl-3 text-left font-normal shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                                                >
                                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    !isDateValid(date, form.getValues('startDate'))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="transition-all duration-200 hover:translate-x-1">
                                <FormLabel className="text-base font-semibold">Project Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="shadow-sm transition-all duration-200 hover:shadow focus:shadow-md">
                                            <SelectValue placeholder="Select project status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="shadow-lg">
                                        <SelectItem value="OPEN">Open</SelectItem>
                                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Public Toggle */}
                    <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-x-1">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-semibold">Public Project</FormLabel>
                                    <FormDescription className="text-sm opacity-80">Make this project visible to everyone</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-primary transition-all duration-200 hover:scale-105"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        size='sm'
                        type="submit"
                        className="w-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:hover:scale-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <><LoadingSpinner /> 'Creating'</> : <>
                            <PlusIcon className="mr-2 h-4 w-4" /> Create Project</>}
                    </Button>
                </form>
            </Form>
        </ErrorBoundary>
    )
}

export default CreateProjectForm
