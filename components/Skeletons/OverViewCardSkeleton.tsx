import { Card, CardContent, CardHeader } from '@/components/ui/card'

const OverviewCardSkeleton = () => {
    const Titles = ['Projects', 'Tasks', 'Overdue', 'Urgent']
    return (
        <>
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                        {Titles[i - 1]}
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="h-7 w-12 bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-3 w-28 bg-muted animate-pulse rounded"></div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

export default OverviewCardSkeleton;