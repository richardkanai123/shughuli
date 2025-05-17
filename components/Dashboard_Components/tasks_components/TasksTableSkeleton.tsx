import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TasksTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/50" />
                <Input
                    disabled
                    placeholder="Search tasks..."
                    className="pl-8 max-w-sm bg-muted/40"
                />
            </div>
            <div className="space-y-2 rounded-md border p-4">
                <div className="h-10 w-full flex gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 flex-1" />
                    ))}
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 animate-pulse bg-muted rounded" />
                ))}
            </div>
        </div>
    );
}