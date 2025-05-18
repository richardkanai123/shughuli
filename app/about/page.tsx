
import AboutContent from "./AboutContent"
export const metadata = {
    title: "About Shughuli",
    description: "Learn more about Shughuli, our mission, and how we can help you manage your tasks effectively.",
    keywords: ["about Shughuli", "task management", "personal productivity"],
    authors: [
        {
            name: "Shughuli Team",
            url: "https://shughuli.com",
        },
    ],
    openGraph: {
        title: "About Shughuli",
        description: "Learn more about Shughuli, our mission, and how we can help you manage your tasks effectively.",
        url: "https://shughuli.com/about",
        siteName: "Shughuli",
        images: [
            {
                url: "https://shughuli.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "About Shughuli"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "About Shughuli",
        description: "Learn more about Shughuli, our mission, and how we can help you manage your tasks effectively.",
        images: [
            {
                url: "https://shughuli.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "About Shughuli"
            }
        ]
    }
}
export default async function AboutPage() {


    return (
        <AboutContent />
    )
}