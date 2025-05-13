import { GetUserNotifications } from "@/lib/actions/notifications/get-notifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const RecentNotifications = async ({ userId }: { userId: string }) => {
    const { notifications, message, status } = await GetUserNotifications(userId)

    if (status !== 200) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">{message}</div>
                </CardContent>
            </Card>
        )
    }

    const unreadNotifications = notifications?.filter(
        notification => !notification.isRead
    ) ?? []

    if (unreadNotifications.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <BellOff className="h-5 w-5" />
                        No New Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        You're all caught up!
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications ({unreadNotifications.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                {unreadNotifications.map((notification) => (
                    <Link
                        key={notification.id}
                        href={notification.link ?? '/dashboard'}
                        className={cn(
                            "p-3 rounded-lg transition-all",
                            "hover:bg-accent hover:shadow-sm",
                            "border border-border/50",
                            "flex flex-col gap-1"
                        )}
                    >
                        <span className="font-medium text-sm">
                            {notification.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {notification.message}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}

export default RecentNotifications