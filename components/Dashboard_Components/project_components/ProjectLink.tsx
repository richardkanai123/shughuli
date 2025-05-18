'use client'
import React from 'react'
import { Project } from "@/lib/generated/prisma";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";
import { formatDistanceToNowStrict } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { getStatusColor } from '@/lib/ProjectColorByStatus';
import { Badge } from '@/components/ui/badge';

const ProjectLink = ({ project }: { project: Project }) => {
    return (
        <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            layout
            className="w-full max-w-[400px] flex-none">
            <Link
                prefetch={true}
                href={`/dashboard/projects/${project.slug}`}
                className="block p-4 rounded-lg border relative overflow-hidden bg-card/50 hover:bg-card transition-colors duration-200 group">
                {/* Background fill effect on hover */}
                <div className="absolute inset-0 bg-primary/5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                <div className="flex justify-between md:flex-row md:items-center gap-4 relative z-10">
                    <div className="flex items-center">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                                project.status === "OPEN"
                                    ? "bg-blue-500/10"
                                    : project.status === "ONGOING"
                                        ? "bg-orange-500/10"
                                        : project.status === "COMPLETED"
                                            ? "bg-green-500/10"
                                            : "bg-purple-500/10"
                            )}>
                            <motion.div
                                initial={{ rotate: 0 }}
                                whileHover={{ rotate: 15 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Folder
                                    className={cn(
                                        "h-5 w-5",
                                        project.status === "OPEN"
                                            ? "text-blue-500"
                                            : project.status === "ONGOING"
                                                ? "text-orange-500"
                                                : project.status === "COMPLETED"
                                                    ? "text-green-500"
                                                    : "text-purple-500"
                                    )}
                                />
                            </motion.div>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-medium line-clamp-1 group-hover:text-primary transition-colors duration-200">
                                {project.name}
                            </h2>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                                Due{" "}
                                {formatDistanceToNowStrict(
                                    new Date(project.dueDate),
                                    { addSuffix: true }
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="md:ml-auto flex flex-col items-start md:items-center gap-3 mt-3 md:mt-0">
                        <div className="flex items-center gap-2 min-w-32">
                            <div className=" w-full max-w-36">
                                <div className="flex justify-between mb-1 text-xs">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <Progress
                                    value={project.progress}
                                    className="h-2 group-hover:opacity-90 transition-opacity"
                                />
                            </div>
                        </div>

                        <Badge
                            variant="outline"
                            className={`ml-1 ${getStatusColor(project.status)} group-hover:border-opacity-80 transition-all`}>
                            {project.status.replace(/_/g, " ")}
                        </Badge>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default ProjectLink