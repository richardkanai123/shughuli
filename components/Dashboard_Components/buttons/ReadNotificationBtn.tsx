'use client';

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'
import { Check, CheckCheck } from "lucide-react";
const ReadNotificationBtn = ({ isRead, notificationId }: { isRead: boolean, notificationId: string }) => {

    const handleReadNotification = async () => {
        // Logic to mark notification as read
        // This could be an API call to update the notification status
        console.log("Notification marked as read", notificationId);
    }

    // Prevent default action if already read
    if (isRead) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-not-allowed"
                disabled
            >
                <CheckCheck className="h-4 w-4 text-green-500" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleReadNotification}
        >
            <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
                <Check className={
                    `h-4 w-4 ${isRead ? "text-green-500" : "text-muted-foreground"}`
                } />
            </motion.div>
        </Button>
    )
}

export default ReadNotificationBtn