import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, BarChart, Calendar } from "lucide-react";
import { Suspense } from "react";

// This would show key metrics at a glance
// async function fetchStats(userId: string) {
//     // This would be replaced with actual data fetching
//     const
//     return {
//         activeProjects: 5,
//         tasksCompleted: 12,
//         tasksOverdue: 3,
//         tasksDueToday: 2
//     };
// }

function StatsContent({ userId }: { userId: string }) {

    const stats = {
        activeProjects: 5,
        tasksCompleted: 12,
        tasksOverdue: 3,
        tasksDueToday: 2
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Active Projects</p>
                            <p className="text-2xl font-bold">{stats.activeProjects}</p>
                        </div>
                        <BarChart className="h-8 w-8 text-blue-500/20" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Completed</p>
                            <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500/20" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Overdue</p>
                            <p className="text-2xl font-bold">{stats.tasksOverdue}</p>
                        </div>
                        <Clock className="h-8 w-8 text-red-500/20" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Due Today</p>
                            <p className="text-2xl font-bold">{stats.tasksDueToday}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-orange-500/20" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function QuickStats({ userId }: { userId: string }) {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-8 w-10" />
                                </div>
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        }>
            <StatsContent userId={userId} />
        </Suspense>
    );
}