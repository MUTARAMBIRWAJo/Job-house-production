import type { Metadata, Viewport } from 'next'

import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Providers } from '@/components/providers/Providers'

export const metadata: Metadata = {
  title: 'Gospel Music Excellence | Job House Production',
  description: 'Discover authentic gospel music, connect with verified artists, access professional studio services, and explore Rwanda\'s vibrant gospel community.',
  keywords: ['gospel music', 'gospel lyrics', 'gospel artists', 'music production', 'studio services', 'Rwanda gospel', 'kinyarwanda music'],
  authors: [{ name: 'Job House Production' }],
  creator: 'Job House Production',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobhouseproduction.com',
    siteName: 'Job House Production',
    title: 'Gospel Music Excellence | Job House Production',
    description: 'Discover authentic gospel music, connect with verified artists, and access professional studio services.',
    images: [{
      url: 'https://jobhouseproduction.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Job House Production Gospel Music Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@jobhouseproduction',
    title: 'Gospel Music Excellence | Job House Production',
    description: 'Discover authentic gospel music and professional studio services.'
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#36261f',
  colorScheme: 'light dark',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          {/* WhatsApp button will be added to specific pages with context */}
        </Providers>
      </body>
    </html>
  )
}
