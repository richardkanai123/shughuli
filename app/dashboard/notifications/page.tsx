import { Suspense } from 'react';
import AuthRequired from '@/components/Public_Components/Profile/AuthRequired';
import { GetUserNotifications } from '@/lib/actions/notifications/get-notifications';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Bell, Filter, CheckCheck, Trash2 } from 'lucide-react';

import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationsList from '@/components/Dashboard_Components/notifications/NotificationList';

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




const NotificationsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return <AuthRequired />;
    }

    const { notifications, message, status } = await GetUserNotifications(session.userId);
    const hasNotifications = status === 200 && notifications && notifications.length > 0;
    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">
                        Stay updated with your project activities and alerts
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {hasNotifications && (
                        <>
                            <Button variant="outline" size="sm" className="gap-1">
                                <CheckCheck className="h-4 w-4" />
                                <span className="hidden sm:inline">Mark all as read</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Clear all</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Separator className="my-4" />

            {status !== 200 || !notifications ? (
                <Card>
                    <CardContent className="p-6">
                        <div
                            role="alert"
                            className="text-center py-12"
                        >
                            <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Bell className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">{message}</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                When you receive notifications about your projects and tasks, they'll appear here.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <TabsList>
                            <TabsTrigger value="all" className="gap-2">
                                All
                                {notifications?.length > 0 && (
                                    <Badge variant="secondary">{notifications.length}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="gap-2">
                                Unread
                                {unreadCount > 0 && (
                                    <Badge variant="secondary">{unreadCount}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="read">Read</TabsTrigger>
                        </TabsList>

                        <Button variant="ghost" size="sm" className="gap-1">
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </Button>
                    </div>

                    <TabsContent value="all" className="mt-0">
                        <Suspense fallback={<NotificationsLoading />}>
                            <NotificationsList notifications={notifications} filter="all" />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="unread" className="mt-0">
                        <Suspense fallback={<NotificationsLoading />}>
                            <NotificationsList notifications={notifications} filter="unread" />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="read" className="mt-0">
                        <Suspense fallback={<NotificationsLoading />}>
                            <NotificationsList notifications={notifications} filter="read" />
                        </Suspense>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default NotificationsPage;