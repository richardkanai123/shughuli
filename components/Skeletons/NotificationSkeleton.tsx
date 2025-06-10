import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

// Loading placeholder component
const NotificationsLoading = () => (
    <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4">
                    <div className="flex gap-4 items-start">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);
export default NotificationsLoading;