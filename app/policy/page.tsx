import { Metadata } from "next";
import Policy from "./Policy";


export const metadata: Metadata = {
    title: "Privacy Policy - Shughuli",
    description: "Read Shughuli's privacy policy and understand how we handle your personal data.",
};

export default function PolicyPage() {
    return (
        <Policy />
    );
}

