import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Edit } from "lucide-react";
import { updateDueDate } from "@/lib/actions/tasks/updateDueDate";
import toast from "react-hot-toast";
import { formatDate } from "date-fns";
import { useRouter } from "next/navigation";
const UpdateTaskDueDate = ({
    taskid,
    dueDate,
    createdAt,
}: {
    taskid: string;
    dueDate: Date;
    createdAt: Date;
}) => {
    const [updatedDueDate, setUpdatedDueDate] = useState<Date | undefined>(
        undefined
    );
    const [open, setOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dueDateReadable = formatDate(dueDate, "PPP ' at 'p 'UTC'");

    const Router = useRouter()
    const handleUpdateDueDate = async () => {
        try {
            setIsUpdating(true);
            if (!updatedDueDate) {
                toast.error("Please select a due date.");
                setIsUpdating(false);
                return;
            }

            const { message, success } = await updateDueDate(taskid, updatedDueDate);
            if (!success) {
                toast.error(message || "Failed to update due date.");
                setIsUpdating(false);
                return;
            }

            toast.success(message);
            Router.refresh();
            setOpen(false);
            setUpdatedDueDate(undefined);
            setIsUpdating(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? `${error.message}`
                    : "Unknown error occurred updating due date"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">
                        {isUpdating ? "Updating..." : dueDate ? "Change" : "Set"}
                    </span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{dueDate ? `Change Due Date: ${dueDateReadable}` : "Set Due Date"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Choose when this task should be completed by.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-2">
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="date-picker"
                            className="px-1">
                            Date
                        </Label>
                        <Popover
                            open={open}
                            onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date-picker"
                                    className="w-32 justify-between font-normal">
                                    {updatedDueDate
                                        ? updatedDueDate.toLocaleDateString()
                                        : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start">
                                <Calendar
                                    mode="single"
                                    selected={updatedDueDate}
                                    // date must not be before the task creation date

                                    disabled={
                                        (date) =>
                                            date < createdAt
                                    }
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setUpdatedDueDate(date);
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="time-picker"
                            className="px-1">
                            Time
                        </Label>
                        <Input
                            type="time"
                            id="time-picker"
                            step="1"
                            defaultValue="00:00:00"
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        disabled={isUpdating}
                        onClick={handleUpdateDueDate}>
                        {isUpdating ? "Updating..." : "Update"}
                    </AlertDialogAction>
                    <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UpdateTaskDueDate;
