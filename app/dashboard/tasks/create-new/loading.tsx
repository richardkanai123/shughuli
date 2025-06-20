import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function CreateTaskLoading() {
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create New Task
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Task Title Field */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Skeleton className="h-4 w-24 mb-1" /> {/* Task Title label */}
                            </div>
                            <Skeleton className="h-10 w-full" /> {/* Input field */}
                        </div>

                        {/* Task Description Field */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Skeleton className="h-4 w-24 mb-1" /> {/* Description label */}
                            </div>
                            <Skeleton className="h-32 w-full" /> {/* Textarea */}
                            <Skeleton className="h-4 w-64" /> {/* Help text */}
                        </div>

                        {/* Status, Priority and Progress */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Task Status */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16 mb-1" /> {/* Status label */}
                                <Skeleton className="h-10 w-full" /> {/* Select */}
                            </div>

                            {/* Task Priority */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16 mb-1" /> {/* Priority label */}
                                <Skeleton className="h-10 w-full" /> {/* Select */}
                            </div>

                            {/* Task Progress */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20 mb-1" /> {/* Progress label */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                        </div>

                        {/* Project Selection */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16 mb-1" /> {/* Project label */}
                            <Skeleton className="h-10 w-full" /> {/* Select */}
                            <Skeleton className="h-4 w-56" /> {/* Help text */}
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 mb-1" /> {/* Due Date label */}
                            <Skeleton className="h-10 w-48" /> {/* Date picker button */}
                            <Skeleton className="h-4 w-64" /> {/* Help text */}
                        </div>

                        {/* Assignee Selection */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 mb-1" /> {/* Assignee label */}
                            <Skeleton className="h-10 w-full" /> {/* Select */}
                            <Skeleton className="h-4 w-48" /> {/* Help text */}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <Skeleton className="h-10 w-24" /> {/* Cancel button */}
                            <Skeleton className="h-10 w-32" /> {/* Create button */}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}