"use client";
import { Project, Task } from "@/lib/generated/prisma";
import { use, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import {
    FolderKanbanIcon,
    ListChecks,
    AlertTriangle,
    Zap,
    AlertCircle
} from "lucide-react";
import StatCard from "./StatCard";

interface OverviewCardsProps {
    tasksPromise: Promise<{
        tasks: Task[] | null;
        message: string;
        status: number;
    }>;
    projectsPromise: Promise<{
        projects: Project[] | null;
        message: string;
        status: number;
    }>;
}


const OverviewCards = ({
    tasksPromise,
    projectsPromise,
}: OverviewCardsProps) => {
    // Use React's use() hook to unwrap the promises
    const tasksData = use(tasksPromise);
    const projectsData = use(projectsPromise);

    // Memoize all the calculations to prevent unnecessary recalculations
    const cardData = useMemo(() => {
        // Destructure the data from the promises
        const { message: tasksMessage, status: tasksStatus, tasks } = tasksData;
        const { message: projectsMessage, status: projectsStatus, projects } = projectsData;

        // Check if we have valid data or error states
        const hasTasksError = !tasks || tasksStatus !== 200;
        const hasProjectsError = !projects || projectsStatus !== 200;

        // Calculate statistics only when we have valid data
        const totalTasks = !hasTasksError ? tasks.length : 0;
        const overdueTasks = !hasTasksError
            ? tasks.filter(
                (task) =>
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "DONE"
            ).length
            : 0;

        const urgentTasks = !hasTasksError
            ? tasks.filter(
                (task) =>
                    (task.priority === "HIGH" || task.priority === "URGENT") &&
                    task.status !== "DONE"
            ).length
            : 0;

        const totalProjects = !hasProjectsError ? projects.length : 0;

        // Calculate completion percentages
        const projectCompletionPercentage = !hasProjectsError && totalProjects > 0
            ? Math.round(
                (projects.filter((p) => p.status === "COMPLETED").length / totalProjects) * 100
            )
            : 0;

        const taskCompletionPercentage = !hasTasksError && totalTasks > 0
            ? Math.round(
                (tasks.filter((t) => t.status === "DONE").length / totalTasks) * 100
            )
            : 0;

        // Determine trends
        const projectTrend: "up" | "down" | null = hasProjectsError ? null : (projectCompletionPercentage >= 50 ? "up" : "down");
        const taskTrend: "up" | "down" | null = hasTasksError ? null : (taskCompletionPercentage >= 50 ? "up" : "down");
        const overdueTrend: "up" | "down" | null = hasTasksError ? null : (overdueTasks === 0 ? "up" : "down");
        const urgentTrend: "up" | "down" | null = hasTasksError ? null : (urgentTasks === 0 ? "up" : "down");

        return [
            {
                title: "Projects",
                value: hasProjectsError ? "!" : totalProjects,
                description: hasProjectsError
                    ? projectsMessage || "Error loading projects"
                    : totalProjects > 0
                        ? `${projectCompletionPercentage}% completed`
                        : "No projects yet",
                gradient: hasProjectsError
                    ? "from-red-500/10 to-red-600/5"
                    : "from-blue-500/10 to-blue-600/5",
                icon: hasProjectsError
                    ? <AlertCircle className="h-5 w-5" />
                    : <FolderKanbanIcon className="h-5 w-5" />,
                trend: projectTrend,
                hasError: hasProjectsError,
                customIndex: 0,
            },
            {
                title: "Tasks",
                value: hasTasksError ? "!" : totalTasks,
                description: hasTasksError
                    ? tasksMessage || "Error loading tasks"
                    : totalTasks > 0
                        ? `${taskCompletionPercentage}% completed`
                        : "No tasks yet",
                gradient: hasTasksError
                    ? "from-red-500/10 to-red-600/5"
                    : "from-purple-500/10 to-purple-600/5",
                icon: hasTasksError
                    ? <AlertCircle className="h-5 w-5" />
                    : <ListChecks className="h-5 w-5" />,
                trend: taskTrend,
                hasError: hasTasksError,
                customIndex: 1,
            },
            {
                title: "Overdue",
                value: hasTasksError ? "!" : overdueTasks,
                description: hasTasksError
                    ? tasksMessage || "Error loading tasks"
                    : overdueTasks > 0
                        ? `${overdueTasks} task${overdueTasks !== 1 ? "s" : ""} past due date`
                        : "No overdue tasks",
                gradient: hasTasksError
                    ? "from-red-500/10 to-red-600/5"
                    : "from-amber-500/10 to-amber-600/5",
                icon: <AlertTriangle className="h-5 w-5" />,
                trend: overdueTrend,
                hasError: hasTasksError,
                customIndex: 2,
            },
            {
                title: "Urgent",
                value: hasTasksError ? "!" : urgentTasks,
                description: hasTasksError
                    ? tasksMessage || "Error loading tasks"
                    : urgentTasks > 0
                        ? `${urgentTasks} high priority task${urgentTasks !== 1 ? "s" : ""}`
                        : "No urgent tasks",
                gradient: hasTasksError
                    ? "from-red-500/10 to-red-600/5"
                    : "from-red-500/10 to-red-600/5",
                icon: hasTasksError ? <AlertCircle className="h-5 w-5" /> : <Zap className="h-5 w-5" />,
                trend: urgentTrend,
                hasError: hasTasksError,
                customIndex: 3,
            },
        ];
    }, [tasksData, projectsData]);

    return (
        <AnimatePresence>
            {cardData.map((card, index) => (
                <StatCard key={`${card.title}-${index}`} card={card} />
            ))}
        </AnimatePresence>
    );
};

export default OverviewCards;
