"use client";

import React, { useMemo } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeIcon, FolderIcon, CheckSquare, Bell, Users, FileText, Plus, SquareMenu } from "lucide-react";
import { motion } from "framer-motion";
import { ModeToggle } from "../Public_Components/Navigation/mode-toggler";
import { getFriendlyName, getIconForSection } from "./HeaderUtils";


const DynamicHeader = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    // Get the current section (last part of the path)
    const currentSection = pathSegments[pathSegments.length - 1];
    const currentIndex = pathSegments.length - 1;

    // Dynamically determine the header name and icon
    const headerInfo = useMemo(() => {
        const name = getFriendlyName(currentSection, pathSegments, currentIndex);
        const icon = getIconForSection(currentSection, pathSegments, currentIndex);
        return { name, icon };
    }, [currentSection, pathSegments, currentIndex]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("w-full flex items-center justify-around p-4 bg-background border-b border-border shadow-sm dark:border-secondary dark:text-muted-foreground transition-all duration-1000"
            )}>
            <SidebarTrigger
                size="icon"
                variant="ghost"
                className="hover:bg-accent/50 transition-all duration-200 active:scale-95">
                <SquareMenu className="h-5 w-5" />
            </SidebarTrigger>

            <div className="flex gap-2 self-end ml-auto text-base ">
                <motion.div
                    key={headerInfo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-row items-center align-middle gap-2 justify-center">
                    <span className="text-xl">{headerInfo.icon}</span>|<span className="text-xl font-semibold tracking-tight">
                        {headerInfo.name}
                    </span>

                </motion.div>
                <div className="ml-3">
                    <ModeToggle />
                </div>
            </div>


        </motion.div>
    );
};

export default DynamicHeader;
