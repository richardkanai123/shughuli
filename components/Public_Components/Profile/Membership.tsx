import { Calendar } from "lucide-react";

export default function MemberSince({ createdAt }: { createdAt: Date }) {
    return (
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Member since: {new Date(createdAt).toLocaleDateString()}</span>
        </div>
    )
}