"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { DeleteNotification } from "@/lib/actions/notifications/deleteNotification";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const DeleteNotificationBtn = ({
    notificationId,
}: {
    notificationId: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter();

    const handleDeleteNotification = async () => {
        try {
            setIsLoading(true);

            if (!notificationId) return;

            toast.promise(DeleteNotification(notificationId), {
                loading: "Deleting notification...",
                success: ({ message, success }) => {
                    if (success) {
                        setIsLoading(false);
                        Router.refresh(); // Refresh the page to update notifications
                        return message || "Notification deleted successfully";
                    } else {
                        setIsLoading(false);
                        return "Failed to delete notification";
                    }
                },
                error: (error) => {
                    setIsLoading(false);
                    Router.refresh(); // Refresh the page to update notifications
                    return error.message || "Failed to delete notification";
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(
                    error.message || "An error occurred while deleting the notification"
                );
            }
            Router.refresh(); // Refresh the page to update notifications
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive/70 hover:text-destructive"
            onClick={handleDeleteNotification}>
            <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </motion.div>
        </Button>
    );
};

export default DeleteNotificationBtn;
