import { ClockIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from '@/lib/generated/prisma';
import ErrorAlert from '../Public_Components/ErrorAlert';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import ClientSideActivityFeed from './ClientSideActivityFeed';

interface ActivityFeedProps {
    activitiesPromise: Promise<{
        message: string;
        success: boolean;
        activities: null | Activity[];
    }>;
}

const ActivityFeed = async ({ activitiesPromise }: ActivityFeedProps) => {
    const { activities, message, success } = await activitiesPromise;

    if (!success) {
        return <ErrorAlert ErrorMessage={message} />;
    }

    if (!activities || activities.length === 0) {
        return (
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                    <CardDescription>Your latest updates</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6 text-muted-foreground">
                    <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <ClockIcon className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p>No recent activity</p>
                    <p className="text-sm mt-1">Your activity will appear here</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                    <Badge variant="secondary">
                        {activities.length} {activities.length === 1 ? 'event' : 'events'}
                    </Badge>
                </div>
                <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-80 w-full pr-4">
                    <ClientSideActivityFeed activities={activities} />
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ActivityFeed