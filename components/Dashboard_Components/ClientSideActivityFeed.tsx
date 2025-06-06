'use client'

import { Activity } from "@/lib/generated/prisma";
import { useEffect, useRef, useState } from "react";
import ActivityItem from "./ActivityItem";

// Client component wrapper for activities
const ClientSideActivityFeed = ({ activities }: { activities: Activity[] }) => {
    const scrollRef = useRef(null);
    const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);

    // Progressive loading effect
    useEffect(() => {
        const loadActivities = async () => {
            const activityChunks = [];
            const chunkSize = 5;

            for (let i = 0; i < activities.length; i += chunkSize) {
                activityChunks.push(activities.slice(i, i + chunkSize));
            }

            for (const chunk of activityChunks) {
                setVisibleActivities(prev => [...prev, ...chunk]);
                if (activityChunks.indexOf(chunk) < activityChunks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
        };

        loadActivities();
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