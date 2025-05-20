'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, SunIcon, SunMoonIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Greetings = ({ username, image }: { username: string, image: string | null }) => {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');

    // Get time-dependent greeting and icon
    const { greetingText, greetingIcon, timeOfDay } = getTimeBasedGreeting();

    // Update time every second
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setCurrentDate(now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }));
        };

        // Update immediately
        updateDateTime();

        // Then update every second
        const timerId = setInterval(updateDateTime, 1000);

        return () => clearInterval(timerId);
    }, []);

    function getTimeBasedGreeting() {
        const hour = new Date().getHours();

        if (hour < 6) {
            return {
                greetingText: "Good Night",
                greetingIcon: <MoonIcon className="h-5 w-5 text-indigo-400" />,
                timeOfDay: "night"
            };
        } else if (hour < 12) {
            return {
                greetingText: "Good Morning",
                greetingIcon: <SunIcon className="h-5 w-5 text-amber-400" />,
                timeOfDay: "morning"
            };
        } else if (hour < 18) {
            return {
                greetingText: "Good Afternoon",
                greetingIcon: <SunIcon className="h-5 w-5 text-amber-500" />,
                timeOfDay: "afternoon"
            };
        } else if (hour < 22) {
            return {
                greetingText: "Good Evening",
                greetingIcon: <SunMoonIcon className="h-5 w-5 text-orange-400" />,
                timeOfDay: "evening"
            };
        } else {
            return {
                greetingText: "Good Night",
                greetingIcon: <MoonIcon className="h-5 w-5 text-indigo-400" />,
                timeOfDay: "night"
            };
        }
    }

    return (
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border shadow-sm">
                <AvatarImage
                    src={image || `https://ui-avatars.com/api/?name=${username}&background=random`}
                    alt={username}
                />
                <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
                <div className="flex items-center gap-2 mb-1">
                    {greetingIcon}
                    <h1 className="text-xl font-semibold">
                        <span className={cn(
                            timeOfDay === "morning" && "text-amber-600 dark:text-amber-400",
                            timeOfDay === "afternoon" && "text-amber-700 dark:text-amber-500",
                            timeOfDay === "evening" && "text-orange-600 dark:text-orange-400",
                            timeOfDay === "night" && "text-indigo-600 dark:text-indigo-400"
                        )}>
                            {greetingText}
                        </span>
                        , {username}
                    </h1>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <motion.span
                            key={currentTime}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentTime}
                        </motion.span>
                    </div>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{currentDate}</span>
                </div>
            </div>
        </div>
    )
}

export default Greetings