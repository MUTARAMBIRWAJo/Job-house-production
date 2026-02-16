'use client'

import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
      // Prevent hydration mismatch by mounting after client-side render
      const [mounted, setMounted] = useState(false)

      useEffect(() => {
            setMounted(true)
      }, [])

      if (!mounted) {
            return <>{children}</>
      }

      return (
            <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
            >
                  {children}
            </ThemeProvider>
      )
}
