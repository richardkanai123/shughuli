import { Card, CardContent, CardHeader } from '@/components/ui/card'
const TaskProgressSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-48 bg-muted animate-pulse rounded mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                        <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-lg border p-3">
                            <div className="h-4 w-16 bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-6 w-8 bg-muted animate-pulse rounded"></div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default TaskProgressSkeleton;
