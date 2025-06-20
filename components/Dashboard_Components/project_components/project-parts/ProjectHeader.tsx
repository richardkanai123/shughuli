"use client";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Link as LinkIcon } from "lucide-react";
import { getStatusColor } from "@/lib/ProjectColorByStatus";
import { Project } from "@/lib/generated/prisma";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import DeleteProjectbtn from "../../buttons/DeleteProjectbtn";
// import ProjectVisibilityBtn from "../../buttons/ProjectVisibilityBtn";
import CompleteProjectBtn from "../../buttons/CompleteProjectBtn";

const ProjectHeader = ({ project }: { project: Project }) => {
    const { name, slug, status, isPublic, id } = project;

    const session = useSession();
    const user = session.data?.userId;
    const isOwner = user === project.ownerId;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-1">
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
                    transition={{ duration: 0.3, delay: 0.2 }}>
                    <Badge
                        variant="secondary"
                        className={cn("text-sm py-1.5 px-3", getStatusColor(status))}>
                        {status}
                    </Badge>
                </motion.div>

                <TooltipProvider skipDelayDuration={100}>
                    {/* Complete Project Button */}
                    {status !== "COMPLETED" &&
                        <CompleteProjectBtn projectId={id} />
                    }

                    {/* Project Visibility Button */}
                    {/* {isOwner && (
                        <ProjectVisibilityBtn
                            projectId={id}
                            isPublic={isPublic}
                        />
                    )} */}

                    {/* edit project */}
                    {isOwner && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline">
                                    <Link
                                        className="flex align-middle justify-center items-center gap-2"
                                        href={`/dashboard/projects/${project.slug}/edit`}>
                                        Edit <Edit2 className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit project details</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* delete Project Button */}
                    {isOwner && <DeleteProjectbtn projectid={project.id} />}
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProjectHeader;
