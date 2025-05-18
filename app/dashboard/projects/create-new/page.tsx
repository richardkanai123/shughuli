import CreateProjectForm from "@/components/Dashboard_Components/CreateProjectForm";
import AuthRequired from "@/components/Public_Components/Profile/AuthRequired";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

// metadata
export const metadata: Metadata = {
    title: 'Create New Project',
    description: 'Create a new project',
}

const CreateProjectPage = async () => {
    const session = await auth.api.getSession(
        {
            headers: await headers()
        }
    )

    if (!session) {
        return (
            <AuthRequired />
        )
    }

    const loggedInUserId = session.userId
    const username = session.username
    return (
        <div className="w-full mx-auto max-w-[800px] py-4 px-2">

            <div className="w-full p-2 flex justify-between align-middle">
                <h1 className="text-sm font-light">
                    hi {username}.
                </h1>

                <h1 className="text-sm font-light">
                    Create New Project
                </h1>
            </div>

            <Suspense fallback={
                <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg">
                    Loading...
                </div>
            }>
                <CreateProjectForm userId={loggedInUserId} />
            </Suspense>
        </div>
    )
}

export default CreateProjectPage