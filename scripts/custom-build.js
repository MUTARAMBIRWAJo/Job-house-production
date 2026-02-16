#!/usr/bin/env node

// Build script that bypasses corepack issues
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Next.js build with custom script...\n');

// Set environment variables
const env = {
  ...process.env,
  NODE_ENV: 'production',
  npm_config_package_manager: 'npm',
  NEXT_TELEMETRY_DISABLED: '1'
};

// Run next build
const buildProcess = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: env,
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build completed successfully!');
  } else {
    console.error(`\n❌ Build failed with exit code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('\n❌ Build error:', error.message);
  process.exit(1);
});
