import DynamicBreadCrumbs from "@/components/Dashboard_Components/DynamicBreadCrumbs"
import DynamicHeader from "@/components/Dashboard_Components/DynamicHeader"
import { AppSidebar } from "@/components/Dashboard_Components/SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="relative">
            <AppSidebar variant="inset" />
            <div className="w-full h-full overflow-hidden px-2 border-l border-gray-200 dark:border-gray-700">
                <DynamicHeader />
                <DynamicBreadCrumbs />

                {children}
            </div>
        </SidebarProvider>
    )
}