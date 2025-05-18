'use client'

import { Sparkles, ListTodo, Shield, Clock, BarChart3, PenLine } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const AboutContent = () => {
    const features = [
        {
            icon: <ListTodo className="h-6 w-6 text-purple-500" />,
            title: "Personal Task Management",
            description: "Create, organize, and track your tasks with an intuitive interface designed for individual productivity."
        },
        {
            icon: <PenLine className="h-6 w-6 text-blue-500" />,
            title: "Project Organization",
            description: "Keep your tasks organized in projects with customizable categories, labels, and priority levels."
        },
        {
            icon: <Shield className="h-6 w-6 text-green-500" />,
            title: "Secure & Private",
            description: "Your personal data stays private with robust security measures and end-to-end encryption."
        },
        {
            icon: <Clock className="h-6 w-6 text-orange-500" />,
            title: "Due Dates & Reminders",
            description: "Set due dates and get timely reminders so you never miss an important deadline."
        },
        {
            icon: <BarChart3 className="h-6 w-6 text-red-500" />,
            title: "Personal Analytics",
            description: "Track your productivity with visual insights into your task completion patterns and habits."
        },
        {
            icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
            title: "Distraction-Free Design",
            description: "Focus on what matters with a clean, minimal interface designed to help you stay on task."
        }
    ]

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };


    return (
        <div className="mx-auto py-16 px-4 bg-gradient-to-b from-background to-background/90">
            {/* Hero Section */}
            <motion.div
                className="text-center mb-16 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-6">
                    About <span className="text-primary">Shughuli</span>
                </h1>
                <p className="text-xl text-muted-foreground mx-auto leading-relaxed">
                    Shughuli is a personal task and project management application designed for individuals who want a simple,
                    efficient way to stay organized and focused on what matters most.
                </p>

                <motion.div
                    className="flex justify-center mt-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Link
                        href="/sign-in"
                        className="px-8 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Get Started Now
                    </Link>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="h-full"
                    >
                        <Card className="h-full border-card hover:border-primary/50 transition-colors duration-300">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl font-medium">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-muted-foreground text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Personal Focus Section */}
            <motion.div
                className="mt-24 text-center max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold mb-8 bg-clip-text text-foreground">
                    Designed for <span className="text-primary">Personal Productivity</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-12">
                    Unlike team-focused tools, Shughuli is built specifically for individuals who want to take control of their personal tasks without the complexity of collaboration features.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                        { value: "5k+", label: "Active Users" },
                        { value: "100k+", label: "Tasks Completed" },
                        { value: "15min", label: "Daily Time Saved" },
                        { value: "99.9%", label: "Uptime" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-lg bg-card border shadow-sm"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl font-bold text-primary">
                                {stat.value}
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Origin Story Section */}
            <motion.div
                className="mt-24 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="bg-card border rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                    <p className="text-muted-foreground">
                        Shughuli (Swahili for "activity" or "task") was born from a simple idea: personal task management
                        shouldn't be complicated. While many productivity tools focus on team collaboration, we recognized
                        the need for a streamlined solution designed specifically for individuals.
                    </p>
                    <p className="text-muted-foreground mt-4">
                        Our mission is to help you focus on what matters most in your personal and professional life by
                        providing a distraction-free environment to manage your tasks and projects.
                    </p>
                </div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
                className="mt-24 max-w-5xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold text-center mb-12">How Shughuli Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-primary text-2xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Create Projects</h3>
                        <p className="text-muted-foreground">
                            Organize your work into projects that reflect your personal and professional goals
                        </p>
                    </motion.div>

                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-primary text-2xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Add Tasks</h3>
                        <p className="text-muted-foreground">
                            Break down your projects into manageable tasks with priorities and due dates
                        </p>
                    </motion.div>

                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-primary text-2xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                        <p className="text-muted-foreground">
                            Monitor your productivity and celebrate completing tasks and projects
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Testimonial Highlight */}
            <motion.div
                className="mt-24 max-w-4xl mx-auto bg-card border rounded-lg p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="text-center mb-6">
                    <span className="text-4xl text-primary">"</span>
                </div>
                <p className="text-xl text-center italic text-muted-foreground mb-6">
                    Since I started using Shughuli, I've been able to organize my personal projects in a way that actually makes sense.
                    No more lost sticky notes or forgotten tasks. Everything I need to do is in one place, and I can finally see my progress.
                </p>
                <div className="flex justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mr-3">
                        <span className="text-lg font-bold">JD</span>
                    </div>
                    <div>
                        <p className="font-medium">Jane Doe</p>
                        <p className="text-sm text-muted-foreground">Freelance Designer</p>
                    </div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                className="mt-24 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

                {[
                    {
                        question: "Is Shughuli suitable for team collaboration?",
                        answer: "Shughuli is designed specifically for individual use. While you can manage personal tasks related to team projects, we focus on providing the best personal task management experience rather than collaboration features."
                    },
                    {
                        question: "Can I access Shughuli on my mobile device?",
                        answer: "Yes! Shughuli is fully responsive and works beautifully on smartphones and tablets, allowing you to manage your tasks on the go."
                    },
                    {
                        question: "Is my data secure?",
                        answer: "Absolutely. We use industry-standard encryption and security practices to ensure your personal task data remains private and protected."
                    },
                    {
                        question: "Can I export my data?",
                        answer: "Yes, Shughuli allows you to export your tasks and projects in common formats so you always have control over your data."
                    }
                ].map((faq, index) => (
                    <motion.div
                        key={index}
                        className="mb-6 border-b pb-6 last:border-b-0"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
                className="mt-24 mb-12 bg-primary/5 rounded-lg p-10 text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold mb-4">Ready to Get Organized?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join thousands of people who have simplified their personal task management with Shughuli.
                    Start for free, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="min-w-[200px]">
                        <Link href="/sign-up">Get Started For Free</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="min-w-[200px]">
                        <Link href="/pricing">View Pricing</Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

export default AboutContent