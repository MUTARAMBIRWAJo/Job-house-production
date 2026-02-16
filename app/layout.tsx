import type { Metadata, Viewport } from 'next'

import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Providers } from '@/components/providers/Providers'

export const metadata: Metadata = {
  title: 'JOB HOUSE PRODUCTION - Gospel Music & Production Platform',
  description: 'Elevating Gospel Music in Rwanda. Gospel lyrics, artist profiles, studio services, and music production.',
  keywords: ['gospel music', 'lyrics', 'kinyarwanda', 'music production', 'studio services', 'Rwanda'],
  authors: [{ name: 'JOB HOUSE PRODUCTION' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobhouseproduction.com',
    siteName: 'JOB HOUSE PRODUCTION',
    title: 'JOB HOUSE PRODUCTION - Gospel Music & Production Platform',
    description: 'Elevating Gospel Music in Rwanda. Gospel lyrics, artist profiles, studio services, and music production.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@jobhouseproduction',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#001f3f',
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
