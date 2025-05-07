import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Shughuli",
    description: "Read Shughuli's privacy policy and understand how we handle your data.",
};

export default function PolicyPage() {
    return (
        <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

            <p className="mb-4">
                At <strong>Shughuli</strong>, your privacy is important to us. This policy explains how we collect,
                use, and protect your personal information.
            </p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                <p>
                    We collect information you provide directly when signing up, such as your name, email, and username.
                    Additionally, we may collect usage data and metadata associated with your projects and tasks.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                <p>
                    Your information is used to provide and improve the Shughuli platform — this includes task
                    management, team collaboration, communication features, and personalized experiences.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
                <p>
                    We do not sell your data. We only share information with third-party services necessary for operating
                    Shughuli, such as authentication, email notifications, and hosting infrastructure.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
                <p>
                    We retain your data as long as your account is active or as needed to provide you services. You may
                    request account deletion at any time.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Security</h2>
                <p>
                    We take appropriate measures to secure your data using encryption and industry best practices. However,
                    no online service is completely secure, and we encourage you to use strong passwords and protect
                    your account.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Changes to This Policy</h2>
                <p>
                    This privacy policy may be updated from time to time. We’ll notify you of significant changes via
                    email or in-app notifications.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
                <p>
                    If you have any questions about this policy or your data, please reach out at{" "}
                    <a href="mailto:support@shughuli.com" className="text-blue-600 underline">
                        support@shughuli.com
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}
