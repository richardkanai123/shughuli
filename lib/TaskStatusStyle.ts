import { Task } from "./generated/prisma"

export const getStatusStyles = (status: Task['status']) => {
    switch (status) {
        case 'DONE':
            return 'bg-green-500/10 text-green-500 border-green-200'
        case 'IN_PROGRESS':
            return 'bg-orange-500/10 text-orange-500 border-orange-200'
        case 'TODO':
            return 'bg-red-500/10 text-red-500 border-red-200'
        case 'BACKLOG':
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-200'
        case 'REVIEW':
            return 'bg-gray-500/10 text-gray-500 border-gray-200'
        default:
            return 'bg-blue-500/10 text-blue-500 border-blue-200'
    }
}