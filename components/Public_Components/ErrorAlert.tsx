'use client'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
const ErrorAlert = ({ ErrorMessage }: { ErrorMessage: string | null | undefined }) => {

    const Router = useRouter()

    if (ErrorMessage?.toLocaleLowerCase() === "unauthorized" || ErrorMessage?.toLocaleLowerCase() === "you are not authorized to access this page") {
        return (
            <div className="container max-w-4xl mx-auto py-10 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Unauthorized</AlertTitle>
                    <AlertDescription>
                        <p className="text-center">You are not authorized to access this page.</p>
                        <Button size='lg' className="mx-auto mt-5 cursor-pointer" onClick={() => Router.push('/sign-in')}>
                            Sign In
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }


    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    <p className="text-center">{ErrorMessage ? ErrorMessage : "An unknown error occurred!"}</p>
                    <Button size='lg' className="mx-auto mt-5 cursor-pointer" onClick={() => Router.refresh()}>
                        Try Again
                    </Button>
                </AlertDescription>
            </Alert>


        </div>
    )
}

export default ErrorAlert