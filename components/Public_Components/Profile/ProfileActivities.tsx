import { CheckCircle2, Clock, Activity } from "lucide-react"

const activities = [
    { type: 'completed', task: 'Homepage Redesign', time: '2 hours ago' },
    { type: 'started', task: 'API Integration', time: '1 day ago' },
    { type: 'comment', task: 'User Authentication', time: '2 days ago' },
]

export function RecentActivity() {
    return (
        <div className="mx-auto mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
            </h2>
            <div className="space-y-4">
                {activities.map((activity, i) => (
                    <ActivityItem key={i} activity={activity} />
                ))}
            </div>
        </div>
    )
}


function ActivityItem({ activity }: { activity: typeof activities[0] }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <ActivityIcon type={activity.type} />
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getActivityText(activity.type)}
                    <span className="font-normal text-gray-600 dark:text-gray-400">
                        {activity.task}
                    </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.time}
                </p>
            </div>
        </div>
    )
}

function ActivityIcon({ type }: { type: string }) {
    const iconClasses = {
        completed: 'bg-green-100 dark:bg-green-900',
        started: 'bg-blue-100 dark:bg-blue-900',
        comment: 'bg-gray-100 dark:bg-gray-900'
    }[type]

    return (
        <div className={`p-2 rounded-full ${iconClasses}`}>
            {type === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : type === 'started' ? (
                <Clock className="w-4 h-4 text-blue-500" />
            ) : (
                <Activity className="w-4 h-4 text-gray-500" />
            )}
        </div>
    )
}

function getActivityText(type: string) {
    return {
        completed: 'Completed task: ',
        started: 'Started working on: ',
        comment: 'Commented on: '
    }[type]
}