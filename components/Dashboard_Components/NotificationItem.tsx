"use client";
import { Notification } from "@/lib/generated/prisma";
import { formatDistanceToNow, format } from "date-fns";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ReadNotificationBtn from "./buttons/ReadNotificationBtn";
import DeleteNotificationBtn from "./buttons/DeleteNotifcationBtn";

interface NotificationItemProps {
    notification: Notification;
    version: 'Full' | 'Compact';
}

const NotificationItem = ({ notification, version }: NotificationItemProps) => {
    const isRead = notification.isRead;

    // Get notification icon based on content
    const getNotificationIcon = () => {
        // Logic to show different icons based on notification type
        if (notification.message?.includes("task"))
            return <Check className="h-5 w-5" />;
        if (notification.message?.includes("project"))
            return <ExternalLink className="h-5 w-5" />;
        return <Bell className="h-5 w-5" />;
    };

    // Format time using date-fns
    const formatTimeAgo = (date: Date) => {
        try {
            // For very recent dates (< 1 day), show relative time
            if (Date.now() - date.getTime() < 86400000) {
                return formatDistanceToNow(date, { addSuffix: true });
            }
            // For older dates, show formatted date
            return format(date, "MMM dd, yyyy");
        } catch (error) {
            return "Unknown date";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "p-1 rounded-lg border mb-2 transition-all duration-200 hover:shadow-sm",
                isRead
                    ? "bg-card hover:bg-muted/50"
                    : "bg-primary/5 hover:bg-primary/10 border-primary/20"
            )}
        >
            <div className="flex flex-col space-y-2">
                {/* Main notification content as a link */}
                <Link
                    href={notification.link || "/dashboard/notifications"}
                    className="flex items-start space-x-2 cursor-pointer"
                >
                    {/* Notification indicator/icon */}
                    <motion.div
                        className={cn(
                            "rounded-full p-1 flex-shrink-0",
                            isRead ? "bg-muted" : "bg-primary/10"
                        )}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {getNotificationIcon()}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4
                                className={cn(
                                    "font-medium line-clamp-1",
                                    !isRead && "font-semibold"
                                )}
                            >
                                {notification.title}
                            </h4>


                        </div>

                        {
                            version === 'Full' && (
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                            )
                        }
                    </div>
                </Link>

                {/* Action buttons - kept outside the link */}
                <div className="flex justify-around ">
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {formatTimeAgo(new Date(notification.createdAt))}
                    </span>
                    <div className="flex space-x-1 justify-end items-end ml-auto">
                        {!isRead && (
                            <ReadNotificationBtn
                                isRead={isRead}
                                notificationId={notification.id}
                            />
                        )}
                        <DeleteNotificationBtn notificationId={notification.id} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NotificationItem;
