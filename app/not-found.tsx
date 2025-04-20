import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            {/* Animated 404 Number */}
            <div className="relative">
                <h1 className="text-[150px] font-bold text-gray-100 dark:text-gray-800 select-none">
                    404
                </h1>
                <h1 className="absolute inset-0 text-[150px] font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
                    404
                </h1>
            </div>

            {/* Error Message */}
            <div className="space-y-4 mb-8 -mt-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Oops! Page not found
                </h2>
                <p className="text-muted-foreground max-w-[500px]">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                    asChild
                    variant="default"
                    className="min-w-[120px]"
                >
                    <Link href="/">
                        Go Home
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    className="min-w-[120px]"
                >
                    <Link href="/about">
                        Learn More
                    </Link>
                </Button>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
                <div className="absolute h-full w-full bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                <div className="absolute h-full w-full backdrop-blur-[10px]" />
            </div>
        </div>
    )
}