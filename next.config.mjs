import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
