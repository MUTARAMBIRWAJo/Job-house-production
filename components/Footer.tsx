import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/Logo_for_JOB_HOUSE_PRODUCTION.png"
                alt="Job House Production"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm opacity-85 leading-relaxed">
              Elevating gospel music across Rwanda through world-class production and artist development services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-base mb-6">Discover</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/lyrics" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Gospel Lyrics</Link></li>
              <li><Link href="/artists" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Featured Artists</Link></li>
              <li><Link href="/news" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Gospel News</Link></li>
              <li><Link href="/about" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-bold text-base mb-6">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/studio" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Studio Recording</Link></li>
              <li><Link href="/studio" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Music Production</Link></li>
              <li><Link href="/studio" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Mixing & Mastering</Link></li>
              <li><Link href="/contact" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all">Custom Services</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-serif font-bold text-base mb-6">Get In Touch</h3>
            <p className="text-sm opacity-85 mb-6 leading-relaxed">
              📞 +250 XXX XXX XXX<br />
              📧 info@jobhouseproduction.com
            </p>
            <div className="flex gap-5">
              <a href="#" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="opacity-80 hover:text-secondary hover:opacity-100 transition-all" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
          <p>&copy; {currentYear} Job House Production. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
