import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AlertTriangle } from 'lucide-react'

const FetchErrorComponent = ({ message }: { message: string | null }) => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-destructive/20">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-destructive/50 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-center text-destructive">Unable to Load Project</CardTitle>
                    <CardDescription className="text-center">
                        We encountered an issue while retrieving the project data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-destructive/10 rounded-md p-4 mb-4">
                        <p className="text-base ">
                            {message || "An unexpected error occurred. Please try again later."}
                        </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p className="mb-2">Possible reasons:</p>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                            <li>Server is currently down</li>
                            <li>Authentication issues</li>
                            <li>Project does not exist or has been deleted</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default FetchErrorComponent