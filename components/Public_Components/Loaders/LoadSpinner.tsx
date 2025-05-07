import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-4 animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
    )
}