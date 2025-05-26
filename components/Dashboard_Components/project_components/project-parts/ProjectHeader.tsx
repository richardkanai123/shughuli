'use client'
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, Lock, TicketCheck, Trash2Icon, Unlock, X } from "lucide-react"
import { getStatusColor } from '@/lib/ProjectColorByStatus'
import { Project } from "@/lib/generated/prisma"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

const ProjectHeader = ({ project }: { project: Project }) => {
    const { name, slug, status, isPublic } = project

    const session = useSession()
    const user = session.data?.userId
    const isOwner = user === project.ownerId

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-1"
            >
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    {slug}
                </CardDescription>
            </motion.div>
            <div className="flex items-center gap-2 flex-wrap">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Badge
                        variant="secondary"
                        className={cn(
                            "text-sm py-1.5 px-3",
                            getStatusColor(status)
                        )}
                    >
                        {status}
                    </Badge>
                </motion.div>

                <TooltipProvider>

                    {/* Project Privacy Toggle Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {
                                            isPublic ? "Privatise" : "Publicise"
                                        }
                                        {isPublic ? (
                                            <Unlock className="h-4 w-4" />
                                        ) : (
                                            <Lock className="h-4 w-4" />
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {isPublic ? "Make Project Private?" : "Make Project Public?"}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {isPublic
                                                ? "This will restrict access to only team members and yourself."
                                                : "This will make the project visible to anyone with the link."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>
                                            {isPublic ? "Make Private" : "Make Public"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isPublic ? "Project is public" : "Project is private"}</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Complete Project Button */}
                    {status !== 'COMPLETED' && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="bg-lime-500 hover:bg-lime-100 text-accent-foreground">
                                            Complete <TicketCheck className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Complete Project
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to mark this project as completed? This action cannot be undone.
                                                <br />
                                                <br />
                                                Once completed, the project will be archived and you will not be able to make further changes.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>
                                                Complete Project
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Close project</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* edit project */}
                    {isOwner && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" >
                                    <Link className="flex align-middle justify-center items-center gap-2" href={`/dashboard/projects/${project.slug}/edit`}>
                                        Edit <X className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit project details</p>
                            </TooltipContent>
                        </Tooltip>

                    )}

                    {/* delete Project Button */}
                    {isOwner && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            Delete <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Project
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this project? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>
                                                Delete Project
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete project</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>

            </div>
        </div >
    )
}

export default ProjectHeader