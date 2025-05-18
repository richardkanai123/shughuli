'use client'

import CTABtn from "@/components/Public_Components/Buttons/CTABtn";
import HomeFeaturesList from "@/components/Public_Components/Navigation/HomeFeatures";
import TestimonialCard from "@/components/Public_Components/Navigation/TestimonialCard";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/Constants";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function HomePage() {
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/90">
            {/* Hero Section */}
            <motion.div
                className="text-center px-6 py-16 max-w-4xl"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div variants={fadeUp}>
                    <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                        Organize Your <span className="text-primary">Personal Tasks</span> With Ease
                    </h1>
                </motion.div>
                <motion.p
                    variants={fadeUp}
                    className="text-xl mt-6 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                >
                    Simplify your daily life and boost your productivity with Shughuli,
                    a personal task management app designed for individuals.
                </motion.p>
                <motion.div
                    variants={fadeUp}
                    className="mt-8 flex gap-4 justify-center items-center flex-wrap"
                >
                    <div className="w-32">
                        <CTABtn />
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-32"
                    >
                        <Link href='/about'> Learn More</Link>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <HomeFeaturesList />

            {/* Benefits Banner */}
            <motion.div
                className="w-full bg-accent/50 py-10 mt-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8">
                    <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                        <span className="text-muted-foreground">No credit card required</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 text-primary mr-2" />
                        <span className="text-muted-foreground">Setup in minutes</span>
                    </div>
                    <div className="flex items-center">
                        <Sparkles className="w-5 h-5 text-primary mr-2" />
                        <span className="text-muted-foreground">Personal dashboard</span>
                    </div>
                </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
                className="w-full max-w-7xl px-6 py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-bold text-center mb-10">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <TestimonialCard {...testimonial} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                className="w-full bg-card py-12 mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="text-center"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-4xl font-bold text-primary">99.9%</div>
                            <p className="mt-2 text-muted-foreground">Uptime</p>
                        </motion.div>
                        <motion.div
                            className="text-center"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-4xl font-bold text-primary">5k+</div>
                            <p className="mt-2 text-muted-foreground">Happy Users</p>
                        </motion.div>
                        <motion.div
                            className="text-center"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-4xl font-bold text-primary">40%</div>
                            <p className="mt-2 text-muted-foreground">Time Saved</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Pricing CTA */}
            <motion.div
                className="w-full max-w-4xl mx-auto px-6 py-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold mb-4">Start Organizing Your Life Today</h2>
                <p className="text-xl text-muted-foreground mb-8">
                    Join thousands of individuals who've already simplified their personal task management with Shughuli.
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
    );
}