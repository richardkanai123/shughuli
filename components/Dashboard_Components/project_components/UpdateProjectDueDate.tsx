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
import {
    Calendar as CalendarIcon,
    Edit,
    Clock,
    Loader2
} from "lucide-react";
import { updateProjectDueDate } from "@/lib/actions/projects/UpdateProjectDueDate";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const UpdateProjectDueDate = ({
    projectId,
    dueDate,
    startDate,
}: {
    projectId: string;
    dueDate: Date;
    startDate: Date;
}) => {
    const [updatedDueDate, setUpdatedDueDate] = useState<Date | undefined>(dueDate);
    const [selectedTime, setSelectedTime] = useState("23:59");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const Router = useRouter();

    const handleUpdateDueDate = async () => {
        try {
            setIsUpdating(true);
            if (!updatedDueDate) {
                toast.error("Please select a due date.");
                return;
            }

            // Combine date and time
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const finalDateTime = new Date(updatedDueDate);
            finalDateTime.setHours(hours, minutes, 0);

            const { message, success } = await updateProjectDueDate(projectId, finalDateTime);
            if (!success) {
                toast.error(message || "Failed to update due date.");
                return;
            }

            toast.success(message);
            Router.refresh();
            setDialogOpen(false);
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

    const hasChanges = updatedDueDate?.getTime() !== dueDate?.getTime() || selectedTime !== "23:59";

    return (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs hover:bg-primary/10"
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                        <Edit className="h-3 w-3 mr-1" />
                    )}
                    Edit
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Update Due Date
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Modify when this project should be completed
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    {/* Date Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Date</Label>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !updatedDueDate && "text-muted-foreground"
                                    )}
                                    onClick={() => setCalendarOpen(true)}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {updatedDueDate ? (
                                        format(updatedDueDate, "PPP")
                                    ) : (
                                        "Pick a date"
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={updatedDueDate}
                                    onSelect={(date) => {
                                        setUpdatedDueDate(date);
                                        setCalendarOpen(false);
                                    }}
                                    disabled={(date) => date < startDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {startDate && (
                            <p className="text-xs text-muted-foreground">
                                Must be after {format(startDate, "MMM dd, yyyy")}
                            </p>
                        )}
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Time</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    {updatedDueDate && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium">Preview:</p>
                            <p className="text-sm text-muted-foreground">
                                {format(updatedDueDate, "PPPP")} at{" "}
                                {format(new Date(`2000-01-01T${selectedTime}`), "h:mm a")}
                            </p>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUpdating}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isUpdating || !updatedDueDate || !hasChanges}
                        onClick={handleUpdateDueDate}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UpdateProjectDueDate;
