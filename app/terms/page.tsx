import { Metadata } from "next";
import Terms from "./Terms";

export const metadata: Metadata = {
    title: "Terms of Service - Shughuli",
    description: "Read the terms and conditions for using Shughuli personal task management tool.",
};

export default function TermsPage() {
    return (
        <Terms />
    )
}
