import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Public_Components/Navigation/Header";
import Footer from "@/components/Public_Components/Navigation/Footer";
import { ThemeProvider } from "@/components/Public_Components/theme-provider";
import { Toaster } from 'react-hot-toast';
const montserrat = Montserrat({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Shughuli - Project Management Made Simple",
  description: "Shughuli is a modern project management tool that helps teams collaborate, track tasks, and deliver projects efficiently.",
  keywords: "project management, task tracking, team collaboration, productivity tools",
  authors: [{ name: "Shughuli Team" }],
  creator: "Shughuli",
  publisher: "Shughuli",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`{${montserrat.className}} ${montserrat.style.fontFamily} bg-background  antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="mx-auto w-full min-h-screen bg-background dark:bg-gray-800">{children}</main>
          <Footer />

          <Toaster />
        </ThemeProvider>
      </body>
    </html >
  );
}
