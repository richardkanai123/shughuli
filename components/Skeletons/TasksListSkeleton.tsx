import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"

export function TasksListSkeleton() {
    return (
        <div className="space-y-3 animate-in fade-in-50">
            {/* Search Bar Skeleton */}
            <div className="relative">
                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground/50" />
                <Input
                    disabled
                    placeholder="Search tasks..."
                    className="pl-8 h-8 text-sm bg-muted/40"
                />
            </div>

            {/* Task Count Skeleton */}
            <div className="px-1">
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Tasks List Skeleton */}
            <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="rounded-md">
                        <div className="px-2 py-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                                <Skeleton className="h-4 w-16 rounded-full" />
                                <Skeleton className="h-4 w-[120px] sm:w-[180px]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-[60px]" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-32 mb-1" />
                    <Skeleton className="h-4 w-52" />
                </CardHeader>
                <CardContent>
                    {/* Filters and Search Skeleton */}
                    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-10 w-[150px]" />
                            <Skeleton className="h-10 w-[150px]" />
                        </div>
                        <Skeleton className="h-10 w-full md:w-[250px]" />
                    </div>

                    {/* Tasks Table Skeleton */}
                    <div className="border rounded-md">
                        <div className="p-2">
                            {/* Table Header */}
                            <div className="grid grid-cols-[50px_1fr_120px_120px_80px] gap-4 py-3 px-4 border-b">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-4" />
                            </div>

                            {/* Table Rows */}
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[50px_1fr_120px_120px_80px] gap-4 py-4 px-4 border-b items-center"
                                    >
                                        <Skeleton className="h-4 w-4 rounded-sm" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-full max-w-[200px]" />
                                            <Skeleton className="h-3 w-full max-w-[160px]" />
                                        </div>
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                        <div className="flex items-center">
                                            <Skeleton className="h-4 w-4 rounded-full mr-2" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-24" />
                    </div>

                    {/* Create Button Skeleton */}
                    <div className="flex justify-center mt-6">
                        <Skeleton className="h-10 w-44" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}