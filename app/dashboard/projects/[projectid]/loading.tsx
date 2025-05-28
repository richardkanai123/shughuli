// Import at top of the file
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

// Add this export for the loading state
export function Loading() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Project Header Loading */}
                <div className="space-y-4">
                    {/* Breadcrumb Loading */}
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Project Card Loading */}
                    <div className="border rounded-lg shadow-sm">
                        {/* Card Header Loading */}
                        <div className="p-6 pb-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-64" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-9 w-24" />
                                </div>
                            </div>
                        </div>

                        {/* Card Content Loading */}
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Description Loading */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>

                                <Separator />

                                {/* Progress Loading */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                    <div className="flex justify-between mt-2">
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </div>

                                <Separator />

                                {/* Details Grid Loading */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                                <Skeleton className="h-7 w-14" />
                                            </div>
                                            <Skeleton className="h-5 w-32" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                                <Skeleton className="h-7 w-14" />
                                            </div>
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-28" />
                                            </div>
                                            <Skeleton className="h-5 w-36" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-28" />
                                            </div>
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Attachments Loading */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4" />
                                            <Skeleton className="h-4 w-28" />
                                        </div>
                                        <Skeleton className="h-7 w-16" />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="border rounded-md overflow-hidden">
                                                <Skeleton className="h-32 w-full" />
                                                <div className="p-2">
                                                    <Skeleton className="h-4 w-full mb-1" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks List Loading */}
                <div className="border rounded-lg shadow-sm">
                    <div className="p-6 pb-3">
                        <div className="flex justify-between items-center mb-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <Skeleton className="h-4 w-56" />
                    </div>

                    <div className="p-6 pt-0">
                        {/* Search and Filters Loading */}
                        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                            <Skeleton className="h-10 w-full md:w-64" />
                        </div>

                        {/* Tasks Table Loading */}
                        <div className="border rounded-md">
                            <div className="p-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <Skeleton className="h-5 w-12" />
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-8" />
                                </div>

                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 border-b">
                                        <Skeleton className="h-4 w-4" />
                                        <div className="space-y-1 w-[200px]">
                                            <Skeleton className="h-5 w-full" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination Loading */}
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading