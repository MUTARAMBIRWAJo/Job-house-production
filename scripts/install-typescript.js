#!/usr/bin/env node

// Simple script to install typescript using npm instead of pnpm
const { execSync } = require('child_process');

console.log('Installing TypeScript using npm...');

try {
  execSync('npm install --save-dev typescript --force', { stdio: 'inherit', cwd: process.cwd() });
  console.log('TypeScript installed successfully!');
} catch (error) {
  console.error('Failed to install TypeScript:', error.message);
  process.exit(1);
}
