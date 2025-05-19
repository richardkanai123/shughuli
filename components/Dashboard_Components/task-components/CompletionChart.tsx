// filepath: d:\Projects\shughuli\components\Dashboard_Components\task-components\TaskCompletionChart.tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle } from "lucide-react";
import { ChartDataItem } from "./taskUtils";
import { CustomTooltip } from "./CustomTooltip";

export default function TaskCompletionChart({ data }: { data: ChartDataItem[] }) {
    return (
        <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                Completion Analysis
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="value"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}