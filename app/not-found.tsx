import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          We couldn't find the page you're looking for. It might have been moved or deleted.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="w-5 h-5" />
              Search
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/lyrics" className="text-sm text-secondary hover:underline">
              Lyrics
            </Link>
            <Link href="/artists" className="text-sm text-secondary hover:underline">
              Artists
            </Link>
            <Link href="/news" className="text-sm text-secondary hover:underline">
              News
            </Link>
            <Link href="/studio" className="text-sm text-secondary hover:underline">
              Studio
            </Link>
            <Link href="/contact" className="text-sm text-secondary hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
