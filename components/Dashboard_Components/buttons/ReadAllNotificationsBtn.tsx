'use client'
import { Button } from '@/components/ui/button'
import { CheckCheck, Loader2 } from 'lucide-react'
import { ReadAllNotifications } from '@/lib/actions/notifications/Read-all'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


const ReadAllNotificationsBtn = () => {
    const [isPending, startTransition] = useTransition()
    const Router = useRouter()

    const handleMarkAllAsRead = async () => {
        startTransition(async () => {
            try {
                const { message, success } = await ReadAllNotifications()
                if (success) {
                    toast.success(message)
                    Router.refresh() // Refresh the page to reflect changes
                } else {
                    toast.error(message)
                }
            } catch (error) {
                toast.error('Failed to mark all notifications as read')
            }
        })
    }


    return (
        <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" className="gap-1">
            {
                isPending ? (
                    <Loader2 className="animate-spin size-4" />
                ) : (
                    <CheckCheck className="size-4" />
                )
            }
            <span className="hidden sm:inline">{
                isPending ? 'Marking all as read...' : 'Mark all as read'
            }</span>
        </Button>
    )
}

export default ReadAllNotificationsBtn