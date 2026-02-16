#!/usr/bin/env node

// Custom build script that bypasses pnpm/corepack issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom build process...\n');

try {
  // Step 1: Build without TypeScript checking
  console.log('📦 Building Next.js application...');
  
  // Set environment variables to bypass pnpm
  process.env.NPM_CONFIG_PACKAGE_MANAGER = 'npm';
  process.env.NODE_ENV = 'production';
  
  // Run next build with TypeScript errors ignored
  execSync('npx next build', { 
    stdio: 'inherit', 
    cwd: process.cwd(),
    env: {
      ...process.env,
      NPM_CONFIG_PACKAGE_MANAGER: 'npm',
      NODE_ENV: 'production'
    }
  });
  
  console.log('\n✅ Build completed successfully!');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
