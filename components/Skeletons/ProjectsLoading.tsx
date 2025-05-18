import { Skeleton } from "@/components/ui/skeleton";

const ProjectsLoadingSkeleton = () => (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
        {/* Search and filters placeholder */}
        <div className="flex flex-col md:flex-row gap-3">
            <Skeleton className="h-10 flex-grow" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-10" />
            </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card/50 p-4 rounded-lg border">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-7 w-10" />
                </div>
            ))}
        </div>

        {/* Projects placeholders */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <Skeleton
                    key={i}
                    className="h-[120px] w-full rounded-lg"
                    style={{ animationDelay: `${i * 100}ms` }}
                />
            ))}
        </div>
    </div>
);

export default ProjectsLoadingSkeleton;