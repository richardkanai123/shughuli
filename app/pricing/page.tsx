'use client'

import React from 'react'
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const pricingPlans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for personal use with essential features",
        features: [
            "Up to 3 active projects",
            "Unlimited tasks",
            "Basic task management",
            "7-day task history",
            "Email support",
        ],
        cta: "Get Started",
        href: "/sign-up",
        highlighted: false
    },
    {
        name: "Pro",
        price: "9",
        description: "For individuals who need advanced productivity tools",
        features: [
            "Unlimited projects",
            "Advanced task management",
            "Priority labels",
            "Recurring tasks",
            "Data export",
            "Unlimited task history",
            "Priority support",

        ],
        cta: "Start Free Trial",
        href: "/sign-up",
        highlighted: true
    },
    {
        name: "Premium",
        price: "19",
        description: "For power users with complex productivity needs",
        features: [
            "Everything in Pro",
            "Advanced analytics",
            "Custom themes",
            "API access",
            "Integrations with popular tools",
            "Advanced filters",
            "Premium support",
            "Early access to new features"
        ],
        cta: "Start Free Trial",
        href: "/sign-up",
        highlighted: false
    }
];

const PricingPage = () => {
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-background to-background/90">
            {/* Header */}
            <motion.div
                className="text-center mb-16 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-foreground">
                    Simple, Personal Pricing
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Choose the plan that fits your personal productivity needs
                </p>
            </motion.div>

            {/* Pricing Grid */}
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <motion.div key={plan.name} variants={item}>
                            <Card className={`h-full flex flex-col overflow-hidden transition-all ${plan.highlighted ? 'border-primary shadow-lg shadow-primary/20' : ''
                                }`}>
                                {plan.highlighted && (
                                    <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
                                        <Sparkles className="h-4 w-4 inline mr-1" /> Most Popular
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-bold">
                                            ${plan.price}
                                        </span>
                                        <span className="ml-1 text-muted-foreground">
                                            /month
                                        </span>
                                    </div>
                                    <CardDescription className="mt-2">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-3 text-sm">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center">
                                                <Check className="h-4 w-4 text-primary mr-2 shrink-0" />
                                                <span>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant={plan.highlighted ? "default" : "outline"}
                                    >
                                        <Link href={plan.href}>
                                            {plan.cta}
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <p className="text-muted-foreground">
                        Have more questions?{" "}
                        <Link
                            href="/contact"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Contact us
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default PricingPage