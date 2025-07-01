'use client'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/components/ui/dialog"

import { deleteProjectAttachment } from '@/lib/actions/projects/delete-Attatchment'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
const DeleteAttachmentBtn = ({ attachmentid }: { attachmentid: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null);
    const Router = useRouter()

    const handleDelete = async () => {
        setError(null);
        startTransition(async () => {
            if (!attachmentid) {
                setError('Attachment ID is required');
                return;
            }
            const response = await deleteProjectAttachment(attachmentid);
            if (response.success) {
                setIsOpen(false);
                toast.success('Attachment deleted successfully');
                setError(null);
                Router.refresh(); // Refresh the page to reflect changes
            } else {
                setError(response.message);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            setError(null)
            setIsOpen(!isOpen)
        }}>
            <DialogTrigger asChild>
                <Button size='icon' variant="destructive">
                    <Trash2Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Attachment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this attachment?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDelete} variant='destructive' type="submit">
                        {isPending ? (
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        ) : <Trash2Icon className="mr-2 h-4 w-4" />}
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>

                {error && (
                    <div className="p-4 text-sm bg-amber-200 rounded-md mt-4">
                        <p className='text-red-600'>{error}</p>
                    </div>
                )}
            </DialogContent>


        </Dialog>
    )
}

export default DeleteAttachmentBtn