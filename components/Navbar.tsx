'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Lyrics', href: '/lyrics' },
    { label: 'Artists', href: '/artists' },
    { label: 'Events', href: '/events' },

    { label: 'News', href: '/news' },
    { label: 'Store', href: '/store' },
    { label: 'Studio', href: '/studio' },

  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/Logo_for_JOB_HOUSE_PRODUCTION.png"
              alt="Job House Production"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="icon" aria-label="Login">
                <LogIn className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </Link>
            <Link href="/studio">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-semibold" size="sm">
                Book Studio
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground hover:bg-muted"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>

              <Link href="/studio" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold">
                  Book Studio
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
