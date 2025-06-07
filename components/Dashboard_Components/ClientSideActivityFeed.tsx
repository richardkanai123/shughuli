'use client'
import { Activity } from "@/lib/generated/prisma";
import { useEffect, useRef, useState } from "react";
import ActivityItem from "./ActivityItem";

// Client component wrapper for activities
const ClientSideActivityFeed = ({ activities }: { activities: Activity[] }) => {
    const scrollRef = useRef(null);
    const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);

    useEffect(() => {
        // Initialize with the first 5 activities
        setVisibleActivities(activities.slice(0, 5));

        // Scroll to the bottom of the activity feed
        if (scrollRef.current) {
            const scrollElement = scrollRef.current as HTMLDivElement;
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [activities]);

    return (
        <div ref={scrollRef} className="space-y-1">
            {visibleActivities.map((activity, index) => (
                <ActivityItem
                    key={activity.id}
                    index={index}
                    activity={activity}
                />
            ))}
        </div>
    );
};


export default ClientSideActivityFeed