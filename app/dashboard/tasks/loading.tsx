import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
    return (
        <div className="w-full p-2 animate-in fade-in duration-300">
            {/* Header */}
            <div className="w-full p-2 flex justify-between align-middle mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-9 w-32" />
            </div>

            {/* Controls section */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between mb-6">
                <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-[120px]" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* Table header */}
            <div className="rounded-md border mb-2">
                <div className="flex items-center p-4 bg-card/50">
                    <div className="flex-1 grid grid-cols-12 gap-2">
                        <Skeleton className="h-4 col-span-5" />
                        <Skeleton className="h-4 col-span-2" />
                        <Skeleton className="h-4 col-span-2" />
                        <Skeleton className="h-4 col-span-3" />
                    </div>
                </div>
            </div>

            {/* Task items */}
            <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="rounded-md border bg-card/50 p-4"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <div className="flex items-center">
                            <Skeleton className="h-4 w-4 mr-4" />
                            <div className="flex-1 grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <div className="col-span-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                                <div className="col-span-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                                <div className="col-span-3">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
            </div>
        </div>
    );
}