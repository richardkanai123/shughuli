import { Skeleton } from "@/components/ui/skeleton";

export default function CreateProjectLoading() {
    return (
        <div className="w-full mx-auto max-w-[800px] py-4 px-2 animate-in fade-in duration-300">
            {/* Header */}
            <div className="w-full p-2 flex justify-between align-middle mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
            </div>

            {/* Form skeleton */}
            <div className="space-y-8 border rounded-lg p-6">
                {/* Form title */}
                <div className="flex justify-center">
                    <Skeleton className="h-7 w-48" />
                </div>

                {/* Project name field */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Project description field */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Dates section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Status selector */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full md:w-1/2" />
                </div>

                {/* Private/public toggle */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-4">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}