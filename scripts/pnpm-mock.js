#!/usr/bin/env node

// Mock pnpm.js file to bypass corepack issue
const { execSync } = require('child_process');

// Get the command line arguments
const args = process.argv.slice(2);

// Convert pnpm command to npm command
if (args[0] === 'add') {
  const npmArgs = ['install', ...args.slice(1)];
  console.log(`Converting pnpm command to: npm ${npmArgs.join(' ')}`);
  
  try {
    execSync(`npm ${npmArgs.join(' ')}`, { stdio: 'inherit', cwd: process.cwd() });
  } catch (error) {
    process.exit(1);
  }
} else {
  console.error(`Unsupported pnpm command: ${args[0]}`);
  process.exit(1);
}
