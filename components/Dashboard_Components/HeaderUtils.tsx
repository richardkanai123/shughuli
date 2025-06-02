'use client'
import { HomeIcon, FolderIcon, CheckSquare, Bell, Users, FileText, Plus, SquareMenu } from "lucide-react";
import { ReactNode } from "react";

// Fix: Change the type annotation to Record<string, ReactNode>
export const sectionIcons: Record<string, ReactNode> = {
    dashboard: <HomeIcon className="h-5 w-5" />,
    files: <FileText className="h-5 w-5" />,
    projects: <FolderIcon className="h-5 w-5" />,
    tasks: <CheckSquare className="h-5 w-5" />,
    notifications: <Bell className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    // Add more section icons as needed
};

// Regular expression to identify UUID-like segments
export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Regular expression for numeric IDs
export const numericIdRegex = /^\d+$/;

// Helper function to check if a segment is likely an ID
export const isIdSegment = (segment: string): boolean => {
    return uuidRegex.test(segment) || numericIdRegex.test(segment) || segment.length > 10;
};

// Helper function to get the entity type based on parent path
export const getEntityTypeFromPath = (pathSegments: string[], currentIndex: number): string => {
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
export const getFriendlyName = (segment: string, pathSegments: string[] = [], index: number = 0): string => {
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
export const getIconForSection = (section: string, pathSegments: string[] = [], index: number = 0): React.ReactNode => {
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