#!/usr/bin/env node

// Mock pnpm script to bypass corepack issue
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

// Handle pnpm add commands
if (args[0] === 'add' && args.includes('typescript')) {
  console.log('🔄 Converting pnpm add typescript to npm install typescript');
  
  // Extract the exact version if specified
  let version = 'latest';
  const versionIndex = args.indexOf('--save-exact');
  if (versionIndex !== -1 && args[versionIndex + 1]) {
    version = args[versionIndex + 1];
  }
  
  const npmArgs = ['install', '--save-dev', `typescript@${version}`];
  
  const npmProcess = spawn('npm', npmArgs, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  npmProcess.on('close', (code) => {
    process.exit(code);
  });
  
  npmProcess.on('error', (error) => {
    console.error('❌ npm install failed:', error.message);
    process.exit(1);
  });
} else {
  console.error('❌ Unsupported pnpm command:', args.join(' '));
  console.log('This mock only supports: pnpm add typescript [--save-exact <version>]');
  process.exit(1);
}
