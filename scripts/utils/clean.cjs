#!/usr/bin/env node

/**
 * Clean Script - Removes build artifacts and caches
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup...\n');

const pathsToClean = [
  'dist',
  'build',
  '.vite',
  'node_modules/.vite',
  'coverage',
  '.nyc_output',
];

pathsToClean.forEach(cleanPath => {
  const fullPath = path.join(__dirname, '..', '..', cleanPath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removing ${cleanPath}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Removed ${cleanPath}`);
  } else {
    console.log(`⏭️  Skipping ${cleanPath} (not found)`);
  }
});

console.log('\n🎉 Cleanup complete!\n');
