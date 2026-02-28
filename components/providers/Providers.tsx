'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
      const [mounted, setMounted] = useState(false)
      
      useEffect(() => {
            setMounted(true)
      }, [])
      
      // Prevent hydration mismatch by only rendering theme after mount
      if (!mounted) {
            return <>{children}</>
      }

      return (
            <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem={false}
                  disableTransitionOnChange
            >
                  {children}
            </ThemeProvider>
      )
}
