"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/generated/prisma";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Target, Paperclip } from "lucide-react";

// Import sub-components
import ProjectHeader from "./project-parts/ProjectHeader";
import ProjectDescription from "./project-parts/ProjectDescription";
import ProjectProgress from "./project-parts/ProjectProgress";
import ProjectDates from "./project-parts/ProjectDates";

const ProjectDetails = ({ project }: { project: Project }) => {
    // Animation states
    const [progressValue, setProgressValue] = useState(0);

    // Animate progress on load
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgressValue(project.progress || 0);
        }, 800); // Reduced delay for better UX
        // Cleanup timer on unmount

        return () => clearTimeout(timer);
    }, [project.progress]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="my-2">
            <Card className="shadow-sm border-0 bg-card">
                {/* Enhanced Header */}
                <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b border-border/50">
                    <ProjectHeader project={project} />
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Description Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Description</h3>
                            </div>
                            <ProjectDescription description={project.description} />
                        </motion.div>

                        <Separator className="my-6" />

                        {/* Progress Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Progress</h3>
                                <Badge
                                    variant="secondary"
                                    className="text-xs">
                                    {progressValue}%
                                </Badge>
                            </div>
                            <ProjectProgress
                                progressValue={progressValue}
                                status={project.status}
                                startDate={project.startDate}
                                endDate={project.endDate}
                            />
                        </motion.div>

                        <Separator className="my-6" />

                        {/* Timeline Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-medium">Timeline</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <ProjectDates
                                    startDate={project.startDate}
                                    endDate={project.endDate}
                                    projectId={project.id}
                                    ownerId={project.ownerId}
                                    dueDate={project.dueDate}
                                />
                            </div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProjectDetails;
