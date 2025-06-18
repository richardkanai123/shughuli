"use client";

import { Button } from "@/components/ui/button";
import { MarkNotificationAsRead } from "@/lib/actions/notifications/ReadNotifcation";
import { motion } from "framer-motion";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
const ReadNotificationBtn = ({
    isRead,
    notificationId,
}: {
    isRead: boolean;
    notificationId: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter()

    const handleReadNotification = async () => {
        try {
            setIsLoading(true);

            if (!notificationId) return;

            toast.promise(MarkNotificationAsRead(notificationId), {
                loading: "Marking notification as read...",
                success: ({ message, success }) => {
                    if (success) {
                        setIsLoading(false);
                        Router.refresh(); // Refresh the page to update notifications
                        return message || "Notification marked as read successfully";
                    } else {
                        setIsLoading(false);
                        return "Failed to mark notification as read";
                    }
                },
                error: (error) => {
                    setIsLoading(false);
                    Router.refresh(); // Refresh the page to update notifications
                    return error.message || "Failed to mark notification as read";
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(
                    error.message || "An error occurred while marking the notification as read"
                );
            }
            setIsLoading(false);
        }
    };

    // Prevent default action if already read
    if (isRead) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-not-allowed"
                disabled>
                <CheckCheck className="h-4 w-4 text-green-500" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleReadNotification}>
            <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Check
                        className={`h-4 w-4 ${isRead ? "text-green-500" : "text-muted-foreground"}`}
                    />
                )}
            </motion.div>
        </Button>
    );
};

export default ReadNotificationBtn;
