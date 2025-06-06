import { format } from 'date-fns'
import { BellRing, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NotificationsPanelProps {
    userId: string;
}

const NotificationsPanel = async ({ userId }: NotificationsPanelProps) => {
    // In a real app, this would fetch notifications from your database
    // For demonstration, creating some placeholder notifications
    const notifications = [
        {
            id: 1,
            title: "Task deadline approaching",
            message: "You have 3 tasks due in the next 48 hours",
            date: new Date(),
            read: false,
            type: "warning"
        },
        {
            id: 2,
            title: "New team member added",
            message: "Sarah Jones has joined Project Alpha",
            date: new Date(Date.now() - 86400000), // 1 day ago
            read: true,
            type: "info"
        },
        {
            id: 3,
            title: "Project status updated",
            message: "Project Beta has been marked as completed",
            date: new Date(Date.now() - 172800000), // 2 days ago
            read: true,
            type: "success"
        }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                    {unreadCount > 0 && (
                        <Badge>{unreadCount} new</Badge>
                    )}
                </div>
                <CardDescription>Your latest updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
                {notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 rounded-lg border ${!notification.read ? 'bg-primary/5' : ''} group animate-in fade-in-50`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 rounded-full p-1.5 ${notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                        notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {notification.type === 'warning' ? (
                                            <AlertCircle className="h-4 w-4" />
                                        ) : notification.type === 'info' ? (
                                            <BellRing className="h-4 w-4" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-sm leading-none">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(notification.date), 'MMM d')}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <BellRing className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <p>No notifications</p>
                        <p className="text-sm mt-1">You're all caught up!</p>
                    </div>
                )}
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