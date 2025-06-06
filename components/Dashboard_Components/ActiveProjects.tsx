import { format } from 'date-fns'
import { BarChart, ClockIcon, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Project } from '@/lib/generated/prisma'
import Link from 'next/link'

interface ActiveProjectsProps {
    projectsPromise: Promise<{
        projects: Project[] | null;
        message: string;
        status: number;
    }>;
}

const ActiveProjects = async ({ projectsPromise }: ActiveProjectsProps) => {
    const { projects, message, status } = await projectsPromise;
    // Handle case when projects are null or empty
    if (!projects || projects.length === 0) {
        return (
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
                    <CardDescription>{message || "No active projects available"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-muted-foreground">
                    <p>Create a new project to get started</p>
                </CardContent>
            </Card>
        );
    }


    // Get active projects (not completed) and sort by recent activity
    const activeProjects = projects
        .filter(project => project.status !== 'COMPLETED' && project.status !== 'CANCELLED')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);


    return (
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
                    <Badge variant="secondary" className="font-normal">
                        {activeProjects.length} of {projects.length}
                    </Badge>
                </div>
                <CardDescription>Your most recently updated projects</CardDescription>
            </CardHeader>
            <CardContent>
                {activeProjects.length > 0 ? (
                    <div className="space-y-4">
                        {activeProjects.map((project) => (
                            <div key={project.id} className="space-y-3 group animate-in fade-in-50">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/dashboard/projects/${project.slug}`}
                                        className="font-medium hover:text-primary transition-colors"
                                    >
                                        {project.name}
                                    </Link>

                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div>Progress</div>
                                        <div>{project.progress || 0}%</div>
                                    </div>
                                    <Progress value={project.progress || 0} className="h-2" />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div>
                                        {project.dueDate && (
                                            <div className="flex items-center text-muted-foreground">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                Due {format(new Date(project.dueDate), 'MMM d')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-1" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <BarChart className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p>No active projects</p>
                        <p className="text-sm mt-1">Create a new project to get started</p>
                    </div>
                )}
            </CardContent>
            {projects.length > 0 && (
                <CardFooter className="pt-0">
                    <a href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                        View all projects
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                </CardFooter>
            )}
        </Card>
    )
}

export default ActiveProjects