import { Metadata } from 'next'
import HomePage from '@/components/Public_Components/HomePage'

// metadata

export const metadata: Metadata = {
  title: 'Shughuli - Personal Task Management',
  description: 'Organize your personal tasks with Shughuli, a simple and effective task management app.',
  keywords: ['task management', 'productivity', 'personal organization'],
  authors: [
    {
      name: 'Your Name',
      url: 'https://yourwebsite.com',
    },
  ],
  openGraph: {
    title: 'Shughuli - Personal Task Management',
    description: 'Organize your personal tasks with Shughuli, a simple and effective task management app.',
    url: 'https://yourwebsite.com',
    siteName: 'Shughuli',
    images: [
      {
        url: 'https://yourwebsite.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shughuli - Personal Task Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shughuli - Personal Task Management',
    description: 'Organize your personal tasks with Shughuli, a simple and effective task management app.',
    images: ['https://yourwebsite.com/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const Home = () => {
  return (
    <HomePage />
  )
}

export default Home