'use client'

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

const CreateNewTaskLink = ({ project }: { project: string | undefined }) => {
    return (
        <Button className="shadow-md hover:opacity-25 transition-all ease-in">
            <Link className="flex items-center gap-2" href={`/dashboard/tasks/create-new${project ? `?project=${project}` : ''}`}>
                <PlusIcon className="w-4 h-4" />
                Add Task
            </Link>
        </Button>
    )
}

export default CreateNewTaskLink