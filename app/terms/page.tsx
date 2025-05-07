import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - Shughuli",
    description: "Read the terms and conditions for using Shughuli.",
};

export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

            <p className="mb-4">
                Welcome to <strong>Shughuli</strong>. By using our platform, you agree to the following terms and
                conditions. Please read them carefully.
            </p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using Shughuli, you confirm that you’ve read, understood, and agreed to be bound by
                    these Terms of Service and our Privacy Policy.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Use of the Platform</h2>
                <p>
                    You agree to use Shughuli for lawful purposes only and not for any fraudulent or malicious activity.
                    You must be 13 years or older to use our services.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account and password. You are
                    responsible for all activities that occur under your account.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Team and Project Data</h2>
                <p>
                    You retain ownership of your content. By submitting content, you grant Shughuli a limited license to
                    use, store, and process it for providing our services.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
                <p>
                    We may suspend or terminate your access to Shughuli if you violate these Terms or misuse the platform.
                    You may also delete your account at any time.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
                <p>
                    Shughuli is provided “as is.” We are not liable for any direct, indirect, or incidental damages
                    resulting from your use of the service.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
                <p>
                    We may update these Terms from time to time. Continued use of the platform after changes means you
                    accept the new Terms.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
                <p>
                    If you have any questions about these Terms, contact us at{" "}
                    <a href="mailto:support@shughuli.com" className="text-blue-600 underline">
                        support@shughuli.com
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}
