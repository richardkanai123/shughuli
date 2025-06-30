"use client";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Link as LinkIcon, FolderOpen } from "lucide-react";
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
import Link from "next/link";
import DeleteProjectbtn from "../../buttons/DeleteProjectbtn";
import CompleteProjectBtn from "../../buttons/CompleteProjectBtn";

const ProjectHeader = ({ project }: { project: Project }) => {
    const { name, slug, status, id } = project;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Project Info */}
            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <CardTitle className="text-2xl font-bold truncate">
                            {name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-xs font-medium text-muted-foreground truncate">
                                {slug}
                            </span>
                        </CardDescription>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-xs font-medium px-2.5 py-1",
                            getStatusColor(status)
                        )}>
                        {status.replace("_", " ")}
                    </Badge>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                <TooltipProvider delayDuration={300}>
                    {/* Complete Project Button */}
                    {status !== "COMPLETED" && <CompleteProjectBtn projectId={id} />}

                    {/* Edit Project Button */}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9"
                                asChild>
                                <Link href={`/dashboard/projects/${project.slug}/edit`}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Edit project details</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Delete Project Button */}
                    <DeleteProjectbtn projectid={project.id} />
                </TooltipProvider>
            </div>
        </motion.div>
    );
};

export default ProjectHeader;
