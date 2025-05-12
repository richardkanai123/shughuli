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

export function NavMain() {

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
            title: "Team",
            url: "/dashboard/teams",
            icon: UsersIcon,
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

    const pathname = usePathname()
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-4">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton isActive={item.url.toLowerCase() === pathname.toLowerCase()} tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <Link className="w-full flex flex-row gap-2" href={item.url}> {item.title}</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup >
    )
}
