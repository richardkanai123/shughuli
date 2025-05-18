'use client'

import ContactForm from "@/components/Public_Components/Forms/ContactForm";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, MessageCircle, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "Contact Us - Shughuli",
//     description: "Get in touch with the Shughuli team for support, questions, or feedback about our personal task management platform."
// };

const ContactPage = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const socialLinks = [
        {
            name: "Twitter",
            href: "https://twitter.com/shughuli",
            icon: <Twitter className="h-5 w-5" />,
            color: "hover:text-blue-400"
        },
        {
            name: "Facebook",
            href: "https://facebook.com/shughuli",
            icon: <Facebook className="h-5 w-5" />,
            color: "hover:text-blue-600"
        },
        {
            name: "Instagram",
            href: "https://instagram.com/shughuli",
            icon: <Instagram className="h-5 w-5" />,
            color: "hover:text-pink-500"
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/company/shughuli",
            icon: <Linkedin className="h-5 w-5" />,
            color: "hover:text-blue-700"
        }
    ];

    const contactInfo = [
        {
            icon: <Mail className="h-5 w-5 text-primary" />,
            title: "Email Us",
            details: "support@shughuli.com",
            description: "For general inquiries and support",
        },
        {
            icon: <Phone className="h-5 w-5 text-primary" />,
            title: "Call Us",
            details: "+254 712 345 678",
            description: "Available weekdays 9AM-5PM EAT",
        },
        {
            icon: <MapPin className="h-5 w-5 text-primary" />,
            title: "Location",
            details: "123 Shughuli St, Nairobi",
            description: "Kenya, 00100",
        },
        {
            icon: <MessageCircle className="h-5 w-5 text-primary" />,
            title: "Chat with Us",
            details: "Available on Dashboard",
            description: "For registered users",
        }
    ];

    return (
        <div className="max-w-6xl w-full mx-auto py-12 px-4 sm:px-6">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    Have questions, feedback, or need support with your personal task management?
                    We're here to help you stay organized and productive.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="overflow-hidden border-border/60">
                        <CardHeader className="bg-muted/50">
                            <CardTitle>Send us a Message</CardTitle>
                            <CardDescription>
                                Fill out the form below and we'll get back to you as soon as possible
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ContactForm />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="border-border/60 h-full">
                        <CardHeader className="bg-muted/50">
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                Other ways to reach our team
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="mt-0.5">{item.icon}</div>
                                        <div>
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-sm text-foreground">{item.details}</p>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <Separator className="my-12" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center"
            >
                <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2>
                <div className="flex justify-center gap-6">
                    {socialLinks.map((social, index) => (
                        <motion.a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center gap-2 text-muted-foreground transition-colors ${social.color}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        >
                            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                                {social.icon}
                            </div>
                            <span className="text-sm">{social.name}</span>
                        </motion.a>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-16 p-6 bg-card border border-border/60 rounded-lg text-center"
            >
                <h3 className="text-lg font-medium mb-2">Fast Response Time</h3>
                <p className="text-muted-foreground">
                    We typically respond to all inquiries within 24 hours during business days.
                </p>
            </motion.div>
        </div>
    );
};

export default ContactPage;
