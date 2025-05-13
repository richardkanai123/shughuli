import { AppSidebar } from "@/components/Dashboard_Components/SideBar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarTrigger variant='outline' className="md:hidden bg-transparent fixed z-100" />
            <AppSidebar />
            <div className="w-full h-full overflow-hiddenW">
                {children}
            </div>
        </SidebarProvider>
    )
}