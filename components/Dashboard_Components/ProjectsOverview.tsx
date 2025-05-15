import React from 'react'
import { GetUserProjects } from '@/lib/actions/projects/get-projects'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckCircle2, Timer, Layers } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { headers } from 'next/headers'
import ProjectStat from './ProjectStat'


const ProjectsOverview = async ({ userid }: { userid: string }) => {
    await headers()
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

    // overdue projects 
    const today = new Date()
    const overdueProjects = projects.filter(project => new Date(project.endDate as Date) < today)
    const overdueRate = Math.round((overdueProjects.length / totalProjects) * 100)


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Projects Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ProjectStat
                        icon={<Layers className="h-4 w-4" />}
                        label="Total"
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
                        className="bg-orange-100 dark:bg-yellow-500"
                    />
                    <ProjectStat
                        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                        label="Completed"
                        value={completedProjects}
                        className="bg-green-100 dark:bg-green-900"
                    />
                    <ProjectStat
                        icon={<Timer className="h-4 w-4 text-red-500" />}
                        label="Overdue"
                        value={overdueProjects.length}
                        className="bg-red-100 dark:bg-red-900"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Completion Rate</span>
                        <span className="font-medium">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />

                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overdue Rate</span>
                        <span className="font-medium">{overdueRate}%</span>
                    </div>
                    <Progress value={overdueRate} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectsOverview