'use client'
import { Notification } from '@/lib/generated/prisma';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationItem from '../NotificationItem';

// Notification list component
const NotificationsList = ({ notifications, filter = 'all' }: { notifications: Notification[]; filter?: 'all' | 'unread' | 'read'; }) => {
    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.isRead)
            : notifications.filter(n => n.isRead);

    if (filteredNotifications.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                    No notifications found
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    When you receive notifications about your projects and tasks, they'll appear here.
                </p>
            </motion.div>
        )
    }

    return (
        <AnimatePresence>
            <div className="space-y-3">
                {filteredNotifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))}
            </div>
        </AnimatePresence>
    );
};

export default NotificationsList;