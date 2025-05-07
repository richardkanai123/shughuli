import { MailWarning } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center space-y-6">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 inline-block">
                    <MailWarning className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {message}
                    </h1>
                </div>
            </div>
        </div>
    )
}