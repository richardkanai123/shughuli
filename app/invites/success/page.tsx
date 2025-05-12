import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Users } from "lucide-react"
import Link from "next/link"

const CreateteamSuccessPage = () => {
    return (
        <div className="container max-w-lg mx-auto min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Invitation Sent!</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Your team member will receive an email with instructions to join the team.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg text-sm">
                        <p className="text-muted-foreground">
                            Once they accept the invitation, they&apos;ll have access to:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Team projects and tasks</li>
                            <li>Shared resources and documents</li>
                            <li>Team communication channels</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button asChild>
                            <Link href="/dashboard" className="flex items-center justify-center gap-2">
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/teams" className="flex items-center justify-center gap-2">
                                <Users className="w-4 h-4" />
                                View Teams
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateteamSuccessPage