import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


const AgendaSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-muted animate-pulse rounded">Today's Agenda</div>
                <div className="h-5 w-24 bg-muted animate-pulse rounded">

                </div>
            </div>
            <div className="h-3 w-48 bg-muted animate-pulse rounded mt-2"></div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                        <div className="mt-1 h-4 w-4 bg-muted animate-pulse rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                            <div className="h-3 w-2/3 bg-muted animate-pulse rounded"></div>
                            <div className="h-3 w-1/3 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

export default AgendaSkeleton;