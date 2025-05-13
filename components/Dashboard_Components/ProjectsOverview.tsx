import React from 'react'
import { GetUserProjects } from '@/lib/actions/projects/get-projects'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckCircle2, Timer, Layers } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProjectStatProps {
    icon: React.ReactNode
    label: string
    value: number
    className?: string
}

const ProjectStat = ({ icon, label, value, className }: ProjectStatProps) => (
    <div className={`p-4 rounded-lg space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
    </div>
)

const ProjectsOverview = async ({ userid }: { userid: string }) => {
    const { message, projects, status } = await GetUserProjects(userid)

    if (status !== 200) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Projects Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </CardContent>
            </Card>
        )
    }

    if (!projects || projects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Projects Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">You have no projects yet</p>
                </CardContent>
            </Card>
        )
    }

    const totalProjects = projects.length
    const completedProjects = projects.filter(project => project.status === "COMPLETED").length
    const ongoingProjects = projects.filter(project => project.status === "ONGOING").length
    const openProjects = projects.filter(project => project.status === "OPEN").length
    const completionRate = Math.round((completedProjects / totalProjects) * 100)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Projects Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ProjectStat
                        icon={<Layers className="h-4 w-4" />}
                        label="Total Projects"
                        value={totalProjects}
                        className="bg-slate-100 dark:bg-slate-800"
                    />
                    <ProjectStat
                        icon={<FolderOpen className="h-4 w-4 text-blue-500" />}
                        label="Open"
                        value={openProjects}
                        className="bg-blue-100 dark:bg-blue-900"
                    />
                    <ProjectStat
                        icon={<Timer className="h-4 w-4 text-orange-500" />}
                        label="Ongoing"
                        value={ongoingProjects}
                        className="bg-orange-100 dark:bg-orange-900"
                    />
                    <ProjectStat
                        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                        label="Completed"
                        value={completedProjects}
                        className="bg-green-100 dark:bg-green-900"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Completion Rate</span>
                        <span className="font-medium">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectsOverview