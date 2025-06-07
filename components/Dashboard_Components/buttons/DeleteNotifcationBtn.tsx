'use client';

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'
import { Trash2 } from "lucide-react";
const DeleteNotificationBtn = ({ notificationId }: { notificationId: string }) => {

    const handleDeleteNotification = async () => {
        // Logic to mark notification as read
        // This could be an API call to update the notification status
        console.log("Notification marked as read", notificationId);
    }


    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive/70 hover:text-destructive"
            onClick={handleDeleteNotification}
        >
            <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
                <Trash2 className="h-4 w-4" />
            </motion.div>
        </Button>
    )
}

export default DeleteNotificationBtn