import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function TasksDueThisWeek({ dueThisWeek }: { dueThisWeek: number }) {

    if (dueThisWeek === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Due This Week</span>
            </div>
            <Badge variant="outline" className="bg-primary/5">
                {dueThisWeek} task{dueThisWeek !== 1 ? 's' : ''}
            </Badge>
        </div>
    );
}