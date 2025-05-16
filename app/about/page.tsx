import { Boxes, Users2, Zap, Shield, Clock, BarChart3 } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AboutPage() {
    const features = [
        {
            icon: <Zap className="h-6 w-6 text-yellow-500" />,
            title: "Efficient Task Management",
            description: "Streamline your workflow with intuitive task creation, assignment, and tracking capabilities."
        },
        {
            icon: <Boxes className="h-6 w-6 text-purple-500" />,
            title: "Project Organization",
            description: "Keep projects organized with customizable workspaces, labels, and hierarchical task structures."
        },
        {
            icon: <Shield className="h-6 w-6 text-green-500" />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with role-based access control and data encryption."
        },
        {
            icon: <Clock className="h-6 w-6 text-orange-500" />,
            title: "Time Tracking",
            description: "Track time spent on tasks and projects with built-in time management tools."
        },
        {
            icon: <BarChart3 className="h-6 w-6 text-red-500" />,
            title: "Analytics & Insights",
            description: "Make data-driven decisions with comprehensive project analytics and performance metrics."
        }
    ]

    return (
        <div className="mx-auto py-12 px-4 bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 from-white to-gray-100">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
                    About TaskForge
                </h1>
                <p className="text-2xl mt-6 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Shughuli is a personal task and project management application designed for individuals who want a simple, efficient way to stay organized without the overhead of teams or collaboration features.
                </p>
            </div>

            <div className="flex justify-center mb-12 animate-in slide-in-from-bottom-5 " style={{ animationDelay: '200ms' }}>
                <Link
                    href="/sign-in"
                    className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-lg hover:animate-pulse transition-all duration-300"
                >
                    Get Started Now
                </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden group bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 border dark:border-gray-700 cursor-alias"
                    >
                        <CardHeader className="space-y-4">
                            <div className="p-3 w-fit rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border dark:border-gray-600">
                                {feature.icon}
                            </div>
                            <CardTitle className="text-xl font-semibold">
                                {feature.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                                {feature.description}
                            </CardDescription>
                        </CardHeader>
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-lg transition-colors duration-300" />
                    </Card>
                ))}
            </div>

            {/* Stats Section */}
            <div className="mt-20 text-center">
                <h2 className="text-3xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Trusted by Teams Worldwide
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "10k+", label: "Active Users" },
                        { value: "50k+", label: "Tasks Completed" },
                        { value: "1k+", label: "Teams" },
                        { value: "99.9%", label: "Uptime" }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                        >
                            <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                {stat.value}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}