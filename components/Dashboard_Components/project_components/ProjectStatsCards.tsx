'use client';
import { Project } from "@/lib/generated/prisma";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BarChart, CheckCircle, Folder, FolderOpen, CalendarCheck2, TimerIcon } from "lucide-react";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    className?: string;
    color?: string;
}

const StatCard = ({ icon, label, value, className, color = "primary" }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
            "p-4 rounded-lg space-y-2 bg-card border",
            "hover:shadow-lg",
            "transition-shadow duration-200",
            className
        )}
    >
        <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
        >
            <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`text-${color}-500`}
            >
                {icon}
            </motion.div>
            <motion.span
                className="text-sm font-medium text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {label}
            </motion.span>
        </motion.div>
        <motion.p
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                delay: 0.3
            }}
        >
            {value}
        </motion.p>
    </motion.div>
);

interface StatsSummaryProps {
    projects: Project[];
    className?: string;
    compact?: boolean;
}

const ProjectsStats = ({ projects, className, compact = false }: StatsSummaryProps) => {
    // Memoize calculations
    const stats = useMemo(() => {
        const inProgress = projects.filter((p) => p.status === "ONGOING").length;
        const completed = projects.filter((p) => p.status === "COMPLETED").length;
        const dueSoon = projects.filter((p) => {
            const dueDate = new Date(p.dueDate);
            const today = new Date();
            const diffDays = Math.ceil(
                (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diffDays <= 7 && p.status !== "COMPLETED";
        }).length;

        const overdue = projects.filter((p) => {
            const dueDate = new Date(p.dueDate);
            const today = new Date();
            const diffDays = Math.ceil(
                (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diffDays > 1 && p.status !== "COMPLETED";
        }).length;

        const openProjects = projects.filter((p) => p.status === "OPEN").length;


        return { inProgress, completed, dueSoon, overdue, openProjects };
    }, [projects])

    const statItems = [
        {
            icon: <Folder className="h-5 w-5" />,
            label: "Total",
            value: projects.length,
            color: "blue"
        },
        {
            icon: <FolderOpen className="h-5 w-5" />,
            label: "Open",
            value: stats.openProjects,
            color: "purple"
        },
        {
            icon: <BarChart className="h-5 w-5" />,
            label: "In Progress",
            value: stats.inProgress,
            color: "orange"
        },
        {
            icon: <CheckCircle className="h-5 w-5" />,
            label: "Completed",
            value: stats.completed,
            color: "green"
        },
        {
            icon: <CalendarCheck2 className="h-5 w-5" />,
            label: "Due this week",
            value: stats.dueSoon,
            color: "yellow"
        },
        {
            icon: <TimerIcon className="h-5 w-5" />,
            label: "Overdue",
            value: stats.overdue,
            color: "red"
        }


    ];

    // For compact mode, only show non-zero stats
    const displayItems = compact
        ? statItems.filter(item => item.value > 0)
        : statItems;

    return (
        <div className={cn(
            "grid gap-3 mb-6",
            compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4",
            className
        )}>
            {displayItems.map((stat, index) => (
                <StatCard
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                    // Stagger the animations
                    className={`animate-delay-${index * 100} ${`bg-${stat.color}-100 dark:bg-${stat.color}-900 `}`}
                />
            ))}
        </div>
    );
};

export default ProjectsStats;