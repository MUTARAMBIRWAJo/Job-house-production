import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Logo_for_JOB_HOUSE_PRODUCTION.png"
                alt="Job House Production"
                className="h-24 w-auto"
              />
            </div>
            <p className="text-sm opacity-80">
              Elevating Gospel Music in Rwanda through professional production and artist development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lyrics" className="hover:text-secondary transition-colors">Gospel Lyrics</Link></li>
              <li><Link href="/artists" className="hover:text-secondary transition-colors">Artists</Link></li>
              <li><Link href="/news" className="hover:text-secondary transition-colors">News</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/studio" className="hover:text-secondary transition-colors">Studio Recording</Link></li>
              <li><Link href="/studio" className="hover:text-secondary transition-colors">Music Production</Link></li>
              <li><Link href="/studio" className="hover:text-secondary transition-colors">Mixing & Mastering</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Custom Services</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <p className="text-sm opacity-80 mb-4">
              📞 +250 XXX XXX XXX<br />
              📧 info@jobhouseproduction.com
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground opacity-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} JOB HOUSE PRODUCTION. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
