'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getEntityTypeFromPath, getFriendlyName, getIconForSection, isIdSegment } from "./HeaderUtils";
import { ChevronRight, HomeIcon } from "lucide-react";
const DynamicBreadCrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    // Get the current section (last part of the path)
    const currentSection = pathSegments[pathSegments.length - 1];
    const currentIndex = pathSegments.length - 1;

    // Dynamically determine the header name and icon
    const headerInfo = useMemo(() => {
        const name = getFriendlyName(currentSection, pathSegments, currentIndex);
        const icon = getIconForSection(currentSection, pathSegments, currentIndex);
        return { name, icon };
    }, [currentSection, pathSegments, currentIndex]);
    return (
        <div className="flex items-center gap-4 bg-background/70  p-2 ">
            <Breadcrumb>
                <BreadcrumbList>

                    {pathSegments.map((segment, index) => {
                        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathSegments.length - 1;

                        // Get a meaningful name instead of showing IDs
                        const segmentName = isIdSegment(segment)
                            ? `${getEntityTypeFromPath(pathSegments, index)} Details`
                            : getFriendlyName(segment);

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
        </div>
    )
}

export default DynamicBreadCrumbs