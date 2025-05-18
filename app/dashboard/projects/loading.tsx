import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function ProjectsLoading() {
    return (
        <div className="w-full p-2 animate-in fade-in duration-500">
            {/* Header section skeleton */}
            <div className="w-full p-2 flex justify-between align-middle mb-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-9 w-32" />
            </div>

            {/* Search and filters skeleton */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <Skeleton className="h-10 flex-grow" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-[180px]" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card p-4 rounded-lg border">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                ))}
            </div>

            {/* Projects list skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`w-full flex flex-wrap justify-center-safe align-middle animate-in fade-in slide-in-from-bottom-5 duration-500`}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="p-4 rounded-lg border bg-card/50 w-full max-w-[400px] h-[120px] relative overflow-hidden">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="ml-4">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-4 w-24 mt-2" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <Skeleton className="h-4 w-36 mb-2" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>

                            {/* Subtle loading indicator */}
                            <div className="absolute bottom-2 right-2 flex items-center text-xs text-muted-foreground">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}