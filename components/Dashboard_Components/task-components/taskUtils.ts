import { Task } from '@/lib/generated/prisma';

export interface TasksData {
    tasks: Task[] | null;
    message: string;
    status: number;
}

export interface TaskStatusCounts {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
    BACKLOG: number;
    REVIEW: number;
}

export interface ChartDataItem {
    name: string;
    value: number;
}

export interface TaskStats {
    totalTasks: number;
    statusCounts: TaskStatusCounts;
    overdueTasks: number;
    dueThisWeek: number;
    completionRate: number;
    completedOnTime: number;
    completedLate: number;
    statusChartData: ChartDataItem[];
    completionChartData: ChartDataItem[];
}

export const COLORS = ['#3b82f6', '#f97316', '#22c55e', '#6b7280'];

export function calculateTaskStats(tasks: Task[]): TaskStats {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const statusCounts: TaskStatusCounts = {
        TODO: 0,
        IN_PROGRESS: 0,
        DONE: 0,
        BACKLOG: 0,
        REVIEW: 0,
    };

    let overdueTasks = 0;
    let dueThisWeek = 0;
    let completedOnTime = 0;
    let completedLate = 0;

    tasks.forEach(task => {
        // Count by status
        statusCounts[task.status]++;

        const dueDate = new Date(task.dueDate as Date);

        // Overdue tasks (due date in past and not completed)
        if (dueDate < today && task.status !== 'DONE' && task.status !== 'BACKLOG') {
            overdueTasks++;
        }

        // Due this week
        if (dueDate >= today && dueDate <= nextWeek && task.status !== 'DONE' && task.status !== 'IN_PROGRESS') {
            dueThisWeek++;
        }

        // Completion stats
        if (task.status === 'DONE') {
            if (task.completedAt) {
                const completedDate = new Date(task.completedAt);
                if (completedDate <= dueDate) {
                    completedOnTime++;
                } else {
                    completedLate++;
                }
            }
        }
    });

    // Calculate completion rate
    const completionRate = tasks.length > 0
        ? Math.round((statusCounts.DONE / tasks.length) * 100)
        : 0;

    // Prepare chart data
    const statusChartData = [
        { name: "To Do", value: statusCounts.TODO },
        { name: "In Progress", value: statusCounts.IN_PROGRESS },
        { name: "Done", value: statusCounts.DONE },
        { name: "Backlog", value: statusCounts.BACKLOG },
    ].filter(item => item.value > 0);

    const completionChartData = [
        { name: "Completed On Time", value: completedOnTime },
        { name: "Completed Late", value: completedLate },
        { name: "Not Completed", value: tasks.length - completedOnTime - completedLate },
    ].filter(item => item.value > 0);

    return {
        totalTasks: tasks.length,
        statusCounts,
        overdueTasks,
        dueThisWeek,
        completionRate,
        completedOnTime,
        completedLate,
        statusChartData,
        completionChartData,
    };
}