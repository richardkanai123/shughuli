'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Team } from "@/lib/generated/prisma"
import { Loader, Plus } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import AuthRequired from "../Profile/AuthRequired"
import LoadingSpinner from "../Loaders/LoadSpinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const inviteSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    teamId: z.string({ required_error: "Please select a team" }),
})


interface InviteToTeamProps {
    teams: Team[]
}

const InviteToTeam = ({ teams }: InviteToTeamProps) => {
    const form = useForm<z.infer<typeof inviteSchema>>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: "",
            teamId: "",
        },
    })


    const { data: session, isPending } = useSession()

    if (!session) {
        return <AuthRequired />
    }

    if (isPending) {
        return (
            <LoadingSpinner />
        )
    }

    async function onSubmit(values: z.infer<typeof inviteSchema>) {
        try {
            // TODO: Implement the invite API call
            console.log(values, session?.userId)
            toast.success("Invitation sent successfully.")
            form.reset()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
            toast.error("Something went wrong. Please try again.")
        }
    }

    return (
        <div className="flex gap-4 flex-wrap justify-around space-y-6">
            <div className="w-full max-w-md space-y-6 p-6 border rounded-lg bg-card">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Invite Team Member</h3>
                    <p className="text-sm text-muted-foreground">
                        Send an invitation to collaborate on your team.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="teamId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Team</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a team" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={team.id}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email address"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The invitation will be sent to this email address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {
                                form.formState.isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />
                            }
                            {form.formState.isSubmitting ? "Sending invitation..." : "Send Invitation"}
                        </Button>
                    </form>
                </Form>
            </div>

            <Card className='flex-1  max-w-md max-h-[200px]'>
                <CardHeader>
                    <CardTitle>Need another team?</CardTitle>
                    <CardDescription>
                        Create a new team for different projects or departments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/create-team" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create New Team
                        </Link>
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}

export default InviteToTeam