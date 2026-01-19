#!/usr/bin/env node

/**
 * Validation Script - Validates project structure and configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating AgroDeep project structure...\n');

let errors = 0;
let warnings = 0;

// Required files
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  '.env.example',
  'README.md',
  'Dockerfile',
  'docker-compose.yml',
];

console.log('📄 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    errors++;
  }
});
console.log();

// Required directories
const requiredDirs = [
  'src',
  'src/app',
  'src/components',
  'src/domain',
  'src/application',
  'src/infrastructure',
  'src/presentation',
  'src/hooks',
  'src/stores',
  'scripts',
  'tests',
  'docs',
];

console.log('📁 Checking required directories...');
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - MISSING`);
    errors++;
  }
});
console.log();

// Check package.json scripts
console.log('📦 Validating package.json scripts...');
const packageJson = require('../../package.json');
const requiredScripts = [
  'dev',
  'build',
  'preview',
  'test',
  'lint',
  'typecheck',
];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ ${script}`);
  } else {
    console.log(`  ⚠️  ${script} - NOT DEFINED`);
    warnings++;
  }
});
console.log();

// Summary
console.log('📊 Validation Summary:');
console.log(`  Files checked: ${requiredFiles.length}`);
console.log(`  Directories checked: ${requiredDirs.length}`);
console.log(`  Scripts checked: ${requiredScripts.length}`);
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}\n`);

if (errors > 0) {
  console.log('❌ Validation failed with errors\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  Validation passed with warnings\n');
  process.exit(0);
} else {
  console.log('✅ Validation passed successfully!\n');
  process.exit(0);
}
