import CreateProjectForm from "@/components/Dashboard_Components/CreateProjectForm";
import AuthRequired from "@/components/Public_Components/Profile/AuthRequired";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

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
            <CreateProjectForm userId={loggedInUserId} />
        </div>
    )
}

export default CreateProjectPage