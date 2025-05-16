import { getProjectDetails } from '@/lib/actions/projects/get-ProjectDetails'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Calendar,
    Clock,
    Users,
    Link as LinkIcon,
    FileText,
    GitBranch
} from "lucide-react"
import { format } from "date-fns"

const ProjectPage = async ({ params }: { params: Promise<{ projectid: string }> }) => {

    const { projectid } = await params
    const data = await getProjectDetails(projectid)

    if (data.status !== 200) {
        return (
            <div>{data.message}</div>
        )
    }

    if (!data.project) {
        return (
            <div>Project not found</div>
        )
    }

    const { description, teamId, name, slug, startDate, endDate, status, ownerId, updatedAt } = data.project

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            case 'ONGOING':
                return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
            default:
                return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
        }
    }

    return (
        <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="container max-w-4xl mx-auto p-6 space-y-8">
                {/* Project Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" />
                                    {slug}
                                </CardDescription>
                            </div>
                            <Badge
                                variant="secondary"
                                className={getStatusColor(status)}
                            >
                                {status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Description */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    Description
                                </div>
                                <p className="text-sm leading-relaxed">
                                    {description}
                                </p>
                            </div>

                            <Separator />

                            {/* Project Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Start Date</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {startDate ? format(new Date(startDate), 'PPP') : 'Not set'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">End Date</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {endDate ? format(new Date(endDate), 'PPP') : 'Not set'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Team ID</span>
                                    </div>
                                    <p className="text-sm font-medium">{teamId || 'No team assigned'}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Last Updated</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {updatedAt ? format(new Date(updatedAt), 'PPP') : 'Not available'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Owner ID</span>
                                    </div>
                                    <p className="text-sm font-medium">{ownerId}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    )
}

export default ProjectPage