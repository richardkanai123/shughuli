import { Skeleton } from "@/components/ui/skeleton";
import { TasksListSkeleton } from "@/components/Skeletons/TasksListSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProjectPageLoading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] max-h-fit">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Project Details Loading Skeleton */}
                <div className="space-y-6">
                    {/* Project Header */}
                    {/* Project description */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Project Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Dates Card */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-24" /> {/* Card title */}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-20" /> {/* Start date label */}
                                        <Skeleton className="h-4 w-24" /> {/* Start date value */}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-20" /> {/* Due date label */}
                                        <Skeleton className="h-4 w-24" /> {/* Due date value */}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-20" /> {/* Created label */}
                                        <Skeleton className="h-4 w-24" /> {/* Created value */}
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-full" /> {/* Edit dates button */}
                            </CardContent>
                        </Card>

                        {/* Progress Card */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-32" /> {/* Card title */}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-24" /> {/* Progress label */}
                                        <Skeleton className="h-4 w-16" /> {/* Progress percentage */}
                                    </div>
                                    <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar */}
                                    <Skeleton className="h-4 w-48" /> {/* Progress status */}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Skeleton className="h-16 w-full" /> {/* Task stat */}
                                    <Skeleton className="h-16 w-full" /> {/* Task stat */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Card */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-24" /> {/* Card title */}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-20" /> {/* Owner label */}
                                        <Skeleton className="h-4 w-24" /> {/* Owner value */}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-20" /> {/* Members label */}
                                        <Skeleton className="h-4 w-16" /> {/* Members count */}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Member avatar */}
                                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Member avatar */}
                                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Member avatar */}
                                </div>
                                <Skeleton className="h-8 w-full" /> {/* Manage team button */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Tasks list skeleton - using existing component */}
            <TasksListSkeleton />
        </div>
    );
}