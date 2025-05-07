import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function AuthRequired() {
    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center space-y-6">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 inline-block">
                    <LogIn className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        You are not signed in
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        You need to sign in to view your profile
                    </p>

                    <Link href="/sign-in">
                        <Button>Sign in</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}