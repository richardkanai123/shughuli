import LoadingSpinner from "@/components/Public_Components/Loaders/LoadSpinner"
import Link from "next/link"
import { Suspense } from "react"
const ResetPasswordForm = () => {

    return (

        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
            <div className='w-full max-w-screen-sm mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden'>
                {/* Gradient Header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-100">
                        Enter your email address and we&apos;ll send you instructions to reset your password.
                    </p>
                </div>

                {/* Form Section */}
                <Suspense fallback={<LoadingSpinner />}>
                    <ResetPasswordForm />
                </Suspense>
                {/* Footer Links */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                        <p className="text-center">
                            Remember your password?
                            <Link href="/sign-in" className="ml-2 text-blue-600 hover:underline">
                                Sign In
                            </Link>
                        </p>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:underline"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordForm