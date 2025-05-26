'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Project } from "@/lib/generated/prisma"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Import sub-components
import ProjectHeader from "./project-parts/ProjectHeader"
import ProjectDescription from "./project-parts/ProjectDescription"
import ProjectProgress from "./project-parts/ProjectProgress"
import ProjectDates from "./project-parts/ProjectDates"
import ProjectAttachments from "./project-parts/ProjectAttachments"

const ProjectDetails = ({ project }: { project: Project }) => {
    // Animation states
    const [progressValue, setProgressValue] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Animate progress on load
    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setProgressValue(project.progress || 0)
        }, 300)

        return () => clearTimeout(timer)
    }, [project.progress])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="overflow-hidden">
                <CardHeader className="relative">
                    <ProjectHeader
                        project={project}
                    />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Description */}
                        <ProjectDescription description={project.description} />

                        <Separator />

                        {/* Progress Section */}
                        <ProjectProgress
                            progressValue={progressValue}
                            status={project.status}
                            startDate={project.startDate}
                            endDate={project.endDate}
                        />

                        <Separator />

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProjectDates
                                startDate={project.startDate}
                                endDate={project.endDate}
                                projectId={project.id}
                            />

                        </div>

                        {/* Attachments Section */}
                        <Separator />

                        <ProjectAttachments
                            attachments={project.attachments || []}
                            projectId={project.id}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default ProjectDetails