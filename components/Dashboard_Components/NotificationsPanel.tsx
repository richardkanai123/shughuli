import { BellRing, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GetUserNotifications } from '@/lib/actions/notifications/get-notifications';
import NotificationItem from './NotificationItem';

interface NotificationsPanelProps {
    userId: string;
}

const NotificationsPanel = async ({ userId }: NotificationsPanelProps) => {

    const { notifications, status, message } = await GetUserNotifications(userId);
    if (status !== 200) {
        return (
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!notifications || notifications.length === 0) {
        return (
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                    <CardDescription>No notifications found</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6 text-muted-foreground">
                    <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <BellRing className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p>No notifications</p>
                    <p className="text-sm mt-1">You're all caught up!</p>
                </CardContent>
            </Card>
        );
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;
    if (unreadCount === 0) {
        return (
            <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                    <CardDescription>All caught up!</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6 text-muted-foreground">
                    <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p>No unread notifications</p>
                </CardContent>
            </Card>
        );
    }



    return (
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Notifications  {unreadCount > 0 && (
                        <Badge>{unreadCount} unread</Badge>
                    )}</CardTitle>


                </div>
                <CardDescription>Your latest updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {notifications.slice(0, 3).map((notification) => (
                        <NotificationItem version='Compact' key={notification.id} notification={notification} />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <a href="/dashboard/notifications" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    View all notifications
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
            </CardFooter>
        </Card>
    )
}

export default NotificationsPanel