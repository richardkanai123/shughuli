"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    BellIcon,
    FolderIcon,
    LayoutDashboardIcon,
    ListIcon,
    UsersIcon,
    UsersRoundIcon,
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavMain() {
    const pathname = usePathname()

    const items = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Projects",
            url: "/dashboard/projects",
            icon: FolderIcon,
        },
        {
            title: "Tasks",
            url: "/dashboard/tasks",
            icon: ListIcon,
        },
        {
            title: "Notifications",
            url: "/dashboard/notifications",
            icon: BellIcon,
        },
        {
            title: "Clients",
            url: "/dashboard/clients",
            icon: UsersRoundIcon,
        }
    ]

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-4">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.url.toLowerCase() === pathname.toLowerCase()}
                                tooltip={item.title}
                            >
                                <Link
                                    href={item.url}
                                    className={cn(
                                        "w-full flex items-center gap-2",
                                        "group relative",
                                        "hover:bg-accent/50 rounded-md",
                                        "transition-all duration-200",
                                        item.url.toLowerCase() === pathname.toLowerCase() && "bg-accent text-primary"
                                    )}
                                >
                                    <div className="flex items-center min-w-[2rem]">
                                        {item.icon && <item.icon className="w-5 h-5" />}
                                    </div>
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
