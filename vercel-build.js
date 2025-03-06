// This is a special build script for Vercel

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting custom Vercel build...');

// Create build log directory
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Ensure lib directory structure is correct
console.log('🔍 Checking lib directory structure...');
const libDir = path.join(__dirname, 'src', 'lib');
const storeDir = path.join(libDir, 'store');

// Create index.ts files to ensure exports
const createOrUpdateFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created/Updated: ${filePath}`);
  } catch (err) {
    console.error(`❌ Error creating/updating ${filePath}:`, err);
  }
};

// Create/update lib/index.ts
createOrUpdateFile(
  path.join(libDir, 'index.ts'),
  `// Generated index file for lib
export * from './animations';
export * from './data';
export * from './facts';
export * from './sounds';
export * from './types';
export * from './utils';
export * from './store';
`);

// Create/update lib/store/index.ts
createOrUpdateFile(
  path.join(storeDir, 'index.ts'),
  `// Generated index file for store
export * from './game-store';
`);

// Run the Next.js build
console.log('🔨 Running Next.js build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
} 