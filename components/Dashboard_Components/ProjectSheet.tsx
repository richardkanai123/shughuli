import { getProjectDetails } from '@/lib/actions/projects/get-ProjectDetails'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { CalendarIcon, Clock, Edit2, ExternalLink, EyeIcon, FolderIcon, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ProjectSheet = async ({ projectid }: { projectid: string }) => {
    const { project, message, status } = await getProjectDetails(projectid);

    if (!project || status !== 200) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Project
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                            <FolderIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Project Not Available</h3>
                        <p className="text-muted-foreground text-center mb-4">{message}</p>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    const {
        name,
        description,
        dueDate,
        progress,
        startDate,
        endDate,
        isPublic,
        slug
    } = project;

    // Format dates for display
    const formattedStartDate = startDate ? format(new Date(startDate), 'MMM dd, yyyy') : 'Not set';
    const formattedDueDate = dueDate ? format(new Date(dueDate), 'MMM dd, yyyy') : 'Not set';
    const formattedEndDate = endDate ? format(new Date(endDate), 'MMM dd, yyyy') : 'Not set';

    // Calculate days remaining or overdue
    const getDaysRemaining = () => {
        if (!dueDate) return null;

        const due = new Date(dueDate);
        const today = new Date();

        const diff = formatDistanceToNowStrict(due, { addSuffix: true });
        return diff;
    };

    const daysRemaining = getDaysRemaining();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Project
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full p-4 ">
                <SheetHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-bold">{name}</SheetTitle>
                    </div>
                    <SheetDescription className="line-clamp-2">{description}</SheetDescription>
                </SheetHeader>

                {/* Progress section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <Separator className="my-4" />

                {/* Project details */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="text-sm font-medium flex items-center">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                {formattedStartDate}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className={cn(
                                "text-sm font-medium flex items-center",
                                dueDate && new Date(dueDate) < new Date() && project.status !== 'COMPLETED'
                                    ? "text-red-500"
                                    : ""
                            )}>
                                <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                {formattedDueDate}
                            </p>
                        </div>

                    </div>

                    {daysRemaining && (
                        <div className="bg-muted p-3 rounded-md">
                            <p className={cn(
                                "text-sm flex items-center",
                                dueDate && new Date(dueDate) < new Date() && project.status !== 'COMPLETED'
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                            )}>
                                <Clock className="h-4 w-4 mr-2" />
                                {daysRemaining}
                            </p>
                        </div>
                    )}
                </div>

                <Separator className="my-4" />
                <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 mt-auto">
                    <Button asChild variant="default" size="sm">
                        <Link href={`/dashboard/projects/${slug}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Project
                        </Link>
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" size="sm">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default ProjectSheet;