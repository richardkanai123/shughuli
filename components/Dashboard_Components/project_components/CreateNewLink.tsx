'use client'

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

const CreateNewLink = () => {
    return (
        <Button className="shadow-md hover:opacity-25 transition-all ease-in">
            <Link className="flex items-center gap-2" href="/dashboard/projects/create-new">
                <PlusIcon className="w-4 h-4" />
                Add Project
            </Link>
        </Button>
    )
}

export default CreateNewLink