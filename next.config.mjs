import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration for external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'zorcojakjufjcvxahaol.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'api.example.com',
      },
    ],
    // Optimize images for better performance
    formats: ['image/avif', 'image/webp'],
  },
  // Completely disable TypeScript to bypass corepack issue
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: undefined,
  },
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  experimental: {
    optimizeCss: false,
  },
}

export default nextConfig
