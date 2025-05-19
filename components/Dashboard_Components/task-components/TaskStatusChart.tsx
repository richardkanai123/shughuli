'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import { ChartDataItem, COLORS } from "./taskUtils";
import { CustomTooltip } from "./CustomTooltip";

export default function TaskStatusChart({ data }: { data: ChartDataItem[] }) {
    return (
        <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-1 text-muted-foreground" />
                Task Status Distribution
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}