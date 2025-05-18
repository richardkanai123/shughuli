"use client";

import React, { useMemo } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ChevronRight, HomeIcon, FolderIcon, CheckSquare, Bell, Users, FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "../Public_Components/Navigation/mode-toggler";

// Icon mapping for common sections
const sectionIcons: Record<string, React.ReactNode> = {
    dashboard: <HomeIcon className="h-5 w-5" />,
    projects: <FolderIcon className="h-5 w-5" />,
    tasks: <CheckSquare className="h-5 w-5" />,
    notifications: <Bell className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    // Add more section icons as needed
};

// Regular expression to identify UUID-like segments
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Regular expression for numeric IDs
const numericIdRegex = /^\d+$/;

// Helper function to check if a segment is likely an ID
const isIdSegment = (segment: string): boolean => {
    return uuidRegex.test(segment) || numericIdRegex.test(segment) || segment.length > 10;
};

// Helper function to get the entity type based on parent path
const getEntityTypeFromPath = (pathSegments: string[], currentIndex: number): string => {
    if (currentIndex <= 0) return "Item";

    // Get the parent segment (e.g., 'tasks', 'projects')
    const parentSegment = pathSegments[currentIndex - 1];

    // Map parent segments to entity types
    const entityMap: Record<string, string> = {
        tasks: "Task",
        projects: "Project",
        users: "User",
        // Add more mappings as needed
    };

    return entityMap[parentSegment] || "Item";
};

// Helper function to get a friendly name from path segment
const getFriendlyName = (segment: string, pathSegments: string[] = [], index: number = 0): string => {
    // Handle ID-like segments
    if (isIdSegment(segment)) {
        const entityType = getEntityTypeFromPath(pathSegments, index);
        return `${entityType} Details`;
    }

    // Handle special cases or patterns
    if (segment.startsWith('create-')) {
        return `New ${segment.replace('create-', '').replace(/-/g, ' ')}`;
    }

    // Handle specific segments with custom naming
    const specialNames: Record<string, string> = {
        dashboard: 'Dashboard',
        // Add more custom names as needed
    };

    if (specialNames[segment]) {
        return specialNames[segment];
    }

    // Default: capitalize and replace hyphens with spaces
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
};

// Helper function to get icon for a section
const getIconForSection = (section: string, pathSegments: string[] = [], index: number = 0): React.ReactNode => {
    // Handle ID segments
    if (isIdSegment(section)) {
        const parentSegment = index > 0 ? pathSegments[index - 1] : '';

        // Return the parent's icon or a details icon
        return sectionIcons[parentSegment] || <FileText className="h-5 w-5" />;
    }

    // Try to find a direct match
    if (sectionIcons[section]) {
        return sectionIcons[section];
    }

    // Check if it's a "create new" type page
    if (section.startsWith('create-')) {
        return <Plus className="h-5 w-5" />;
    }

    // Default icon for unknown sections
    return <FileText className="h-5 w-5" />;
};

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
            className={cn(
                "mx-auto w-full p-4",
                "bg-background/75 backdrop-blur-md",
                "border-b border-border/40",
                "flex flex-col md:flex-row items-center justify-between",
                "sticky top-0 z-20",
                "shadow-sm",
                "transition-all duration-200"
            )}>
            <div className="flex items-center gap-4">
                <SidebarTrigger
                    size="icon"
                    variant="ghost"
                    className="hover:bg-accent/50 transition-all duration-200 active:scale-95">
                    <Menu className="h-5 w-5" />
                </SidebarTrigger>

                <motion.div
                    key={headerInfo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2">
                    <span className="text-xl">{headerInfo.icon}</span>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {headerInfo.name}
                    </h1>
                </motion.div>
            </div>

            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/dashboard"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <HomeIcon className="h-3 w-3" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {pathSegments.map((segment, index) => {
                            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                            const isLast = index === pathSegments.length - 1;

                            // Get a meaningful name instead of showing IDs
                            const segmentName = isIdSegment(segment)
                                ? `${getEntityTypeFromPath(pathSegments, index)} Details`
                                : getFriendlyName(segment);

                            return (
                                <BreadcrumbItem key={path}>
                                    <ChevronRight className="h-3 w-3" />

                                    {isLast ? (
                                        <BreadcrumbPage className="capitalize">
                                            {segmentName}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink
                                            href={path}
                                            className="capitalize text-muted-foreground hover:text-foreground"
                                        >
                                            {segmentName}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
                <ModeToggle />
            </div>
        </motion.div>
    );
};

export default DynamicHeader;
