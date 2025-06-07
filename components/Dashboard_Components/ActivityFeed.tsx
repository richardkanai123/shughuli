import { ClockIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Activity } from "@/lib/generated/prisma";
import ErrorAlert from "../Public_Components/ErrorAlert";
import { ScrollArea } from "../ui/scroll-area";
import ClientSideActivityFeed from "./ClientSideActivityFeed";
import { Suspense } from "react";

interface ActivityFeedProps {
    activitiesPromise: Promise<{
        message: string;
        success: boolean;
        activities: null | Activity[];
    }>;
}

const ActivityFeed = async ({ activitiesPromise }: ActivityFeedProps) => {
    const { activities, message, success } = await activitiesPromise;

    if (!success) {
        return <ErrorAlert ErrorMessage={message} />;
    }

    return (
        <Card className="transition-all hover:shadow-md animate-in fade-in-50 duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        Recent Activity
                    </CardTitle>
                </div>
                <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense
                    fallback={
                        <div className="text-center py-6 text-muted-foreground">
                            <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <ClockIcon className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p>Loading activity...</p>
                        </div>
                    }>
                    {!activities || activities.length === 0 ? (
                        <div className="text-center py-3 px-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                                    <svg
                                        className="w-48 h-48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 8V12L15 15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>

                                <div className="relative flex flex-col items-center">
                                    <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                                        <ClockIcon className="h-8 w-8 text-muted-foreground/70" />
                                    </div>

                                    <h3 className="text-lg font-medium mb-1">No activity yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs">
                                        Your recent actions on projects and tasks will appear here
                                        as a timeline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="h-80 w-full pr-4">
                            <ClientSideActivityFeed activities={activities} />
                        </ScrollArea>
                    )}
                </Suspense>
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;
