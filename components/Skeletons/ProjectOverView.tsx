import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ProjectsOverviewSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">
                    <Skeleton className="h-6 w-[180px]" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-lg space-y-2 bg-muted/50"
                        >
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-8 w-12" />
                        </div>
                    ))}
                </div>

                {/* Progress Bars */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default ProjectsOverviewSkeleton