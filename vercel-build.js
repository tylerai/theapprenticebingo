// This is a special build script for Vercel

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting custom Vercel build...');

// Debug: List contents of the current directory
try {
  console.log('📂 Current directory contents:');
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} catch (err) {
  console.error('❌ Error listing directory:', err);
}

// Create build log directory
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Ensure lib directory structure is correct
console.log('🔍 Checking lib directory structure...');
const libDir = path.join(__dirname, 'src', 'lib');
const storeDir = path.join(libDir, 'store');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Ensure src directory exists
ensureDirectoryExists(path.join(__dirname, 'src'));
// Ensure lib directory exists
ensureDirectoryExists(libDir);
// Ensure store directory exists
ensureDirectoryExists(storeDir);

// Debug: List contents after creating directories
try {
  console.log('📂 src/lib directory contents:');
  const libFiles = fs.readdirSync(libDir);
  libFiles.forEach(file => {
    console.log(`- ${file}`);
  });
} catch (err) {
  console.error('❌ Error listing src/lib directory:', err);
}

// Create index.ts files to ensure exports
const createOrUpdateFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created/Updated: ${filePath}`);
  } catch (err) {
    console.error(`❌ Error creating/updating ${filePath}:`, err);
    throw err; // Re-throw to stop the build if this fails
  }
};

// Check if important files exist before trying to reference them
const checkFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: File does not exist: ${filePath}`);
    // Create a simple export if missing
    createOrUpdateFile(
      filePath,
      `// Auto-generated placeholder file
export const placeholder = true;
`
    );
    return false;
  }
  return true;
};

// Check required files
console.log('🔍 Checking for required files...');
const requiredFiles = [
  path.join(libDir, 'animations.ts'),
  path.join(libDir, 'data.ts'),
  path.join(libDir, 'facts.ts'),
  path.join(libDir, 'sounds.ts'),
  path.join(libDir, 'types.ts'),
  path.join(libDir, 'utils.ts'),
  path.join(storeDir, 'game-store.ts')
];

const missingFiles = requiredFiles.filter(file => !checkFileExists(file));
if (missingFiles.length > 0) {
  console.warn(`⚠️ Warning: ${missingFiles.length} required files are missing and have been created as placeholders.`);
}

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