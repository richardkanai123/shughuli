import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
        </div>
    )
}