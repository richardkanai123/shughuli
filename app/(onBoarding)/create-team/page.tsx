"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { teamSchema } from "@/lib/validation/teams"
import { createTeam } from "@/lib/actions/team/Create-Team"
import { error } from "console"

export default function CreateTeamPage() {
    const router = useRouter()

    const form = useForm<z.infer<typeof teamSchema>>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof teamSchema>) {
        try {
            const result = await createTeam(values)

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success(result.message || "Team created successfully")
            form.reset()
            router.push('/dashboard/teams')

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
            toast.error("Something went wrong, please try again.")
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create a New Team</h1>
                <p className="text-muted-foreground mt-2">
                    Create a team to collaborate with others on projects.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter team name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your team&apos;s display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter team description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Briefly describe your team&apos;s purpose.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Creating..." : "Create Team"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}