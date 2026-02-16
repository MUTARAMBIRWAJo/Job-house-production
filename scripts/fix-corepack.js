#!/usr/bin/env node

// Fix corepack pnpm issue by creating a mock pnpm executable
const fs = require('fs');
const path = require('path');

const corepackPath = path.join('C:', 'Program Files', 'nodejs', 'node_modules', 'corepack', 'dist');
const pnpmJsPath = path.join(corepackPath, 'pnpm.js');

// Create directory if it doesn't exist
if (!fs.existsSync(corepackPath)) {
  try {
    fs.mkdirSync(corepackPath, { recursive: true });
  } catch (error) {
    console.log('Cannot create corepack directory - trying alternative approach');
  }
}

// Create a simple pnpm.js that redirects to npm
const pnpmMockContent = `
#!/usr/bin/env node
const { spawn } = require('child_process');
const args = process.argv.slice(2);

// Convert pnpm add to npm install
if (args[0] === 'add') {
  const npmArgs = ['install', ...args.slice(1)];
  console.log('Converting pnpm command to npm:', npmArgs.join(' '));
  
  const npmProcess = spawn('npm', npmArgs, { 
    stdio: 'inherit', 
    cwd: process.cwd() 
  });
  
  npmProcess.on('close', (code) => {
    process.exit(code);
  });
} else {
  console.error('Unsupported pnpm command:', args[0]);
  process.exit(1);
}
`;

try {
  fs.writeFileSync(pnpmJsPath, pnpmMockContent);
  console.log('✅ Created mock pnpm.js file');
} catch (error) {
  console.log('Cannot write pnpm.js - trying alternative approach');
}

// Create the mock pnpm.js file
try {
  const { execSync } = require('child_process');
  execSync('node -e "' + pnpmMockContent.replace(/\n/g, '\\n') + '"', { stdio: 'inherit' });
} catch (error) {
  console.log('Alternative approach needed');
}