'use client'
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { ClearNotifications } from "@/lib/actions/notifications/Delete-all";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DeleteAllNotificationsBtn = () => {
    const [isPending, startTransition] = useTransition();
    const Router = useRouter();
    const handleDeleteAll = () => {
        startTransition(async () => {
            try {
                const result = await ClearNotifications();
                if (result.success) {
                    toast.success(result.message);
                    Router.refresh();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("An error occurred while clearing notifications.");
            }
        });
    };

    return (
        <Button variant="outline" size="sm" className="gap-1" onClick={handleDeleteAll}>
            {
                isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />

                ) : (
                    <>
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear all</span>
                    </>
                )
            }
        </Button>
    )
}

export default DeleteAllNotificationsBtn