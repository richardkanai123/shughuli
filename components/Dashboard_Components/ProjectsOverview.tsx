import React from 'react'
import { GetUserProjects } from '@/lib/actions/projects/get-projects'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckCircle2, Timer, Layers } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { headers } from 'next/headers'
import ProjectStat from './ProjectStat'
import { getStatusColor } from '@/lib/ProjectColorByStatus'


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
    const overdueProjects = projects.filter(project => new Date(project.dueDate as Date) < today)
    const overdueRate = Math.round((overdueProjects.length / totalProjects) * 100)
    const overdueProjectsCount = overdueProjects.length
    const overdueProjectsList = overdueProjects.map(project => (
        <li key={project.id} className="text-sm text-muted-foreground">{project.name}</li>
    ))
    const overdueProjectsMessage = overdueProjectsCount > 0 ? (
        <div>
            <p className="text-sm text-muted-foreground">Overdue Projects:</p>
            <ul className="mt-1">{overdueProjectsList}</ul>
        </div>
    ) : (
        <p className="text-sm text-muted-foreground">No overdue projects</p>
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Projects Overview</CardTitle>
                <p className="text-sm text-muted-foreground">You have {totalProjects} projects</p>

            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2  gap-4">

                    <ProjectStat
                        icon={<FolderOpen className="h-4 w-4 text-blue-500" />}
                        label="Open"
                        value={openProjects}
                        className={getStatusColor("OPEN")}
                    />
                    <ProjectStat
                        icon={<Timer className="h-4 w-4 text-orange-500" />}
                        label="Ongoing"
                        value={ongoingProjects}
                        className={getStatusColor("ONGOING")}
                    />
                    <ProjectStat
                        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                        label="Completed"
                        value={completedProjects}
                        className={getStatusColor("COMPLETED")}
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
            <CardFooter>
                {overdueProjectsMessage}
            </CardFooter>

        </Card>
    )
}

export default ProjectsOverview