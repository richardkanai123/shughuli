'use client';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
const Terms = () => {
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
                <ScrollText className="h-10 w-10 text-primary mb-4" />
                <h1 className="text-3xl font-bold text-center">Terms of Service</h1>
                <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
            </div>

            <motion.p
                variants={fadeIn}
                className="mb-8 text-muted-foreground"
            >
                Welcome to <span className="font-semibold text-foreground">Shughuli</span>. By using our personal task management platform, you agree to the following terms and
                conditions. Please read them carefully.
            </motion.p>

            <motion.div variants={stagger} className="space-y-8">
                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground">
                        By accessing or using Shughuli, you confirm that you've read, understood, and agreed to be bound by
                        these Terms of Service and our Privacy Policy.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">2. Use of the Platform</h2>
                    <p className="text-muted-foreground">
                        You agree to use Shughuli for lawful purposes only and not for any fraudulent or malicious activity.
                        You must be 13 years or older to use our services.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">3. User Accounts</h2>
                    <p className="text-muted-foreground">
                        You are responsible for maintaining the confidentiality of your account and password. You are
                        responsible for all activities that occur under your account.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">4. Your Content</h2>
                    <p className="text-muted-foreground">
                        You retain ownership of your content (tasks, projects, notes). By submitting content, you grant Shughuli a limited license to
                        use, store, and process it solely for providing our personal task management services.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">5. Termination</h2>
                    <p className="text-muted-foreground">
                        We may suspend or terminate your access to Shughuli if you violate these Terms or misuse the platform.
                        You may also delete your account at any time through your account settings.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
                    <p className="text-muted-foreground">
                        Shughuli is provided "as is." We are not liable for any direct, indirect, or incidental damages
                        resulting from your use of the service, including loss of data or tasks.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">7. Changes to Terms</h2>
                    <p className="text-muted-foreground">
                        We may update these Terms from time to time. Continued use of the platform after changes means you
                        accept the new Terms.
                    </p>
                </motion.section>

                <motion.section variants={fadeIn} className="space-y-2">
                    <h2 className="text-xl font-semibold">8. Contact</h2>
                    <p className="text-muted-foreground">
                        If you have any questions about these Terms, contact us at{" "}
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
export default Terms