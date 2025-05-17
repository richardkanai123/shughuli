import { Task } from "./generated/prisma"

export const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
        case 'HIGH':
            return 'bg-orange-500/10 text-orange-500 border-orange-200'
        case 'MEDIUM':
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-200'
        case 'LOW':
            return 'bg-green-500/10 text-green-500 border-green-200'
        case 'URGENT':
            return 'bg-red-500/10 text-red-500 border-red-200'
    }
}