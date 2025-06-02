import DynamicBreadCrumbs from "@/components/Dashboard_Components/DynamicBreadCrumbs"
import DynamicHeader from "@/components/Dashboard_Components/DynamicHeader"
import { AppSidebar } from "@/components/Dashboard_Components/SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="relative">
            <AppSidebar variant="sidebar" />
            <div className="w-full h-full overflow-hidden ">
                <DynamicHeader />
                <DynamicBreadCrumbs />

                {children}
            </div>
        </SidebarProvider>
    )
}