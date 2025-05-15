"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ChevronRight, HomeIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "../Public_Components/Navigation/mode-toggler";

const paths = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "📊",
    },
    {
        path: "/dashboard/projects",
        name: "Projects",
        icon: "📁",
    },
    {
        path: "/dashboard/tasks",
        name: "Tasks",
        icon: "✓",
    },
    {
        path: "/dashboard/teams",
        name: "Teams",
        icon: "👥",
    },
    {
        path: "/dashboard/notifications",
        name: "Notifications",
        icon: "🔔",
    },
    {
        path: "/dashboard/clients",
        name: "Clients",
        icon: "🤝",
    },
    {
        path: "/projects/create-new",
        name: "New Project",
        icon: "➕",
    },
    {
        path: "/tasks/create-new",
        name: "New Task",
        icon: "➕",
    },
    {
        path: "/teams/create-new",
        name: "New Team",
        icon: "➕",
    },
    {
        path: "/clients/create-new",
        name: "Add Client",
        icon: "➕",
    },
];

const DynamicHeader = () => {
    const pathname = usePathname();
    const header = paths.find((path) => pathname.endsWith(path.path));
    const pathSegments = pathname.split("/").filter(Boolean);

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
                    key={header?.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2">
                    <span className="text-xl">{header?.icon}</span>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {header?.name}
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
                            const segmentName = segment.replace(/-/g, " ");

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
