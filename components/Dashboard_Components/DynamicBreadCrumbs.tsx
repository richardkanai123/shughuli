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

    // Memoize the breadcrumb segments to avoid unnecessary recalculations
    const breadcrumbSegments = useMemo(() => {
        return pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const segmentName = isIdSegment(segment)
                ? `${getEntityTypeFromPath(pathSegments, index)} Details`
                : getFriendlyName(segment, pathSegments, index);

            return {
                name: segmentName,
                icon: getIconForSection(segment, pathSegments, index),
                isLast
            };
        });
    }, [pathSegments]);

    return (
        <div className="flex items-center gap-4 bg-background/70  p-2 ">
            <Breadcrumb>
                <BreadcrumbList>

                    {breadcrumbSegments.map((segment, index) => {
                        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathSegments.length - 1;

                        return (
                            <BreadcrumbItem key={path}>
                                <ChevronRight className="h-3 w-3" />

                                {isLast ? (
                                    <BreadcrumbPage className="capitalize">
                                        {segment.name}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        href={path}
                                        className="capitalize text-muted-foreground hover:text-foreground"
                                    >
                                        {segment.name}
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