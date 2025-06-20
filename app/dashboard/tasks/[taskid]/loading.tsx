import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, User, FileText, Clock, BarChart3, Calendar } from 'lucide-react';

export default function TaskDetailsLoading() {
    return (
        <div className='p-4 space-y-6'>
            {/* Task Header Loading State */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" /> {/* Task title */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Skeleton className="h-6 w-24" /> {/* Status badge */}
                        <Skeleton className="h-6 w-28" /> {/* Priority badge */}
                    </div>
                </div>
                <Skeleton className="h-10 w-32" /> {/* Created date button */}
            </div>

            {/* Divider */}
            <Skeleton className="h-px w-full" />

            {/* Task Progress Loading State */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Skeleton className="h-4 w-24" /> {/* Progress title */}
                    </div>
                    <Skeleton className="h-4 w-12" /> {/* Progress percentage */}
                </div>
                <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar */}
                <Skeleton className="h-4 w-36" /> {/* Progress status */}
            </div>

            {/* Task Details Cards Loading State */}
            <div className="grid grid-cols-1 gap-6">
                {/* Description Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </CardContent>
                </Card>

                {/* People Card
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            People
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Created by:</span>
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Assigned to:</span>
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Project:</span>
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            {/* Task Timeline Loading State */}
            <div className="space-y-3">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Skeleton className="h-4 w-24" /> {/* Timeline title */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created and Updated Dates */}
                    <div className="space-y-1 border rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Created:</span>
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Last Updated:</span>
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1 border rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-7 w-16" /> {/* Edit button */}
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" /> {/* Due date */}
                            <Skeleton className="h-4 w-36" /> {/* Days remaining */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons Loading State */}
            <div className="flex items-center flex-wrap justify-center gap-3 p-2 border-t pt-4">
                <Skeleton className="h-10 w-32" /> {/* Complete button */}
                <Skeleton className="h-10 w-32" /> {/* Edit button */}
                <Skeleton className="h-10 w-32" /> {/* Delete button */}
            </div>

            {/* Additional Information Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Assigned To
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Assigned To
                            </p>
                            <Skeleton className="h-4 w-24" />
                        </div> */}

                        {/* Project */}
                        <div className="space-y-1">
                            <div className='flex items-center gap-2'>
                                <p className="text-sm font-medium flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Project
                                </p>
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}