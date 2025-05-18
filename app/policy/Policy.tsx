'use client';
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
const Policy = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="flex flex-col items-center mb-8">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
                <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
            </div>

            <motion.p
                variants={fadeIn}
                className="mb-8 text-muted-foreground"
            >
                At <span className="font-semibold text-foreground">Shughuli</span>, your privacy is important to us. This policy explains how we collect,
                use, and protect your personal information when you use our personal task management application.
            </motion.p>

            <motion.div variants={stagger} className="space-y-8">
                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">1. Information We Collect</h2>
                    <p className="text-muted-foreground">
                        We collect information you provide when signing up, such as your name, email, and username.
                        We also collect data about your tasks and projects to provide the service functionality.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground">
                        Your information is used to provide and improve the Shughuli platform — this includes task
                        management, project organization, reminders, and personalizing your experience.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">3. Data Sharing</h2>
                    <p className="text-muted-foreground">
                        We do not sell your data. We only share information with third-party services necessary for operating
                        Shughuli, such as authentication, email notifications, and hosting infrastructure.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">4. Data Retention</h2>
                    <p className="text-muted-foreground">
                        We retain your data as long as your account is active or as needed to provide you services. You may
                        request account deletion at any time through your account settings.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">5. Security</h2>
                    <p className="text-muted-foreground">
                        We take appropriate measures to secure your data using encryption and industry best practices. However,
                        no online service is completely secure, and we encourage you to use strong passwords and protect
                        your account.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">6. Changes to This Policy</h2>
                    <p className="text-muted-foreground">
                        This privacy policy may be updated from time to time. We'll notify you of significant changes via
                        email or in-app notifications.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">7. Contact Us</h2>
                    <p className="text-muted-foreground">
                        If you have any questions about this policy or your data, please reach out at{" "}
                        <a href="mailto:support@shughuli.com" className="text-primary hover:underline transition-colors">
                            support@shughuli.com
                        </a>
                        .
                    </p>
                </motion.section>
            </motion.div>
        </motion.main>
    );
}

export default Policy