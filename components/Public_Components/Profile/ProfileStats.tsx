interface ProfileStatsProps {
    role: string
}

export function ProfileStats({ role }: ProfileStatsProps) {
    return (
        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="text-center">
                <span className="block text-xl font-bold text-gray-900 dark:text-white">0</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Projects</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-gray-900 dark:text-white">0</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Tasks</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-gray-900 dark:text-white">
                    {role}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
            </div>
        </div>
    )
}