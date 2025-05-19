import { Skeleton } from "@/components/ui/skeleton";

// Loading skeletons for each component
const TaskStatusSummarySkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-12" />
            </div>
        ))}
    </div>
);

const CompletionProgressSkeleton = () => (
    <div className="mb-6">
        <div className="flex justify-between mb-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-2 w-full" />
    </div>
);

const TaskUrgentAlertSkeleton = () => (
    <Skeleton className="h-20 w-full mb-6" />
);

const TasksDueThisWeekSkeleton = () => (
    <div className="mb-6">
        <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-6 w-24" />
    </div>
);

const ChartSkeleton = ({ title }: { title: string }) => (
    <div>
        <div className="flex items-center mb-3">
            <Skeleton className="h-4 w-4 mr-1" />
            <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-48 w-full rounded-md" />
    </div>
);

const TasksDueTodaySkeleton = () => (
    <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);

export { TaskStatusSummarySkeleton, CompletionProgressSkeleton, TaskUrgentAlertSkeleton, TasksDueThisWeekSkeleton, ChartSkeleton, TasksDueTodaySkeleton };