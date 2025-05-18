"use client";
import { Project } from "@/lib/generated/prisma";
import Link from "next/link";
import { use, useState, useMemo, Suspense, lazy, useEffect } from "react";
import {
    FolderOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import ErrorState from "./ProjectErrorState";
import SortControls from "./SortControls";
import ProjectsStats from "./ProjectStatsCards";
// Lazy load the ProjectLink component
const ProjectLink = lazy(() => import("./ProjectLink"));

// Types
type SortField = "name" | "dueDate" | "progress" | "status";
type SortDirection = "asc" | "desc";





const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
    <div className="flex flex-col items-center justify-center py-10">
        <FolderOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No Projects Found</h3>
        <p className="text-muted-foreground mt-2">
            {searchTerm
                ? "No projects match your search criteria"
                : "You haven't created any projects yet"}
        </p>
        <Button className="mt-4" asChild>
            <Link href="/dashboard/projects/create">Create Project</Link>
        </Button>
    </div>
);



// Debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Main component
const ProjectsLister = ({
    projects,
}: {
    projects: Promise<{
        projects: Project[] | null;
        message: string;
        status: number;
    }>;
}) => {
    // Data fetching
    const { message, status, projects: data } = use(projects);

    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Debounce search for performance
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    // Memoize filtered and sorted projects for performance
    const filteredProjects = useMemo(() => {
        if (!data) return [];

        // First filter by search term
        const filtered = data.filter(
            (project) =>
                project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );

        // Then sort
        return [...filtered].sort((a, b) => {
            // Helper function to compare values
            const compare = (valA: any, valB: any) => {
                if (valA < valB) return sortDirection === "asc" ? -1 : 1;
                if (valA > valB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            };

            // Compare based on selected field
            switch (sortField) {
                case "name":
                    return compare(a.name, b.name);
                case "dueDate":
                    return compare(new Date(a.dueDate), new Date(b.dueDate));
                case "progress":
                    return compare(a.progress, b.progress);
                case "status":
                    return compare(a.status, b.status);
                default:
                    return 0;
            }
        });
    }, [data, debouncedSearchTerm, sortField, sortDirection]);

    // Handle different states
    if (status !== 200) {
        return <ErrorState message={message} />;
    }

    if (!data || data.length === 0) {
        return <EmptyState searchTerm={searchTerm} />;
    }

    return (
        <div className="space-y-4 w-full">
            {/* Stats Summary - memoized component */}
            {data && <ProjectsStats projects={data} />}

            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                />
                <SortControls
                    sortField={sortField}
                    onSortFieldChange={setSortField}
                    sortDirection={sortDirection}
                    onToggleDirection={toggleSortDirection}
                />
            </div>


            {/* Project List */}
            <div className="w-full flex flex-wrap gap-2 justify-center-safe align-middle">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No projects match your search criteria
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <Suspense
                                key={project.id}
                                fallback={
                                    <div className="w-full max-w-[400px] h-[120px] bg-card/30 animate-pulse rounded-lg border"></div>
                                }
                            >
                                <ProjectLink project={project} />
                            </Suspense>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProjectsLister;
