import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';


const ActiveProjectsSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-3 w-48 bg-muted animate-pulse rounded mt-2"></div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                            <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                                <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="h-2 w-full bg-muted animate-pulse rounded"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                        </div>

                        <Separator />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

const ActivityFeedSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-3 w-48 bg-muted animate-pulse rounded mt-2"></div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                        <div className="flex-1 p-3 rounded-lg border">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-full bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

const NotificationsSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-3 w-48 bg-muted animate-pulse rounded mt-2"></div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg border">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 rounded-full p-1.5 bg-muted animate-pulse h-7 w-7"></div>
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                                    <div className="h-3 w-12 bg-muted animate-pulse rounded"></div>
                                </div>
                                <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)


export {
    ActiveProjectsSkeleton,
    ActivityFeedSkeleton,
    NotificationsSkeleton
};