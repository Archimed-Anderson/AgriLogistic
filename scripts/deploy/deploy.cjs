#!/usr/bin/env node

/**
 * Deployment Script for AgroDeep Platform
 * Handles deployment to various environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const environment = args[0] || 'staging';

console.log(`🚀 Starting deployment to ${environment}...\n`);

// Step 1: Validate environment
console.log('🔍 Validating environment...');
const validEnvironments = ['development', 'staging', 'production'];
if (!validEnvironments.includes(environment)) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.error(`Valid environments: ${validEnvironments.join(', ')}`);
  process.exit(1);
}
console.log(`✅ Environment validated: ${environment}\n`);

// Step 2: Run tests
console.log('🧪 Running tests...');
try {
  execSync('npm run test:ci', { stdio: 'inherit' });
  console.log('✅ Tests passed\n');
} catch (error) {
  console.error('❌ Tests failed');
  process.exit(1);
}

// Step 3: Build for production
console.log('📦 Building for production...');
try {
  execSync('node scripts/build/build-prod.js', { stdio: 'inherit' });
  console.log('✅ Build completed\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 4: Generate deployment manifest
console.log('📝 Generating deployment manifest...');
const manifest = {
  environment,
  version: require('../../package.json').version,
  deployTime: new Date().toISOString(),
  commitHash: getGitCommitHash(),
  branch: getGitBranch(),
};

const distPath = path.join(__dirname, '..', '..', 'dist');
fs.writeFileSync(
  path.join(distPath, 'deployment-manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('✅ Deployment manifest generated\n');

// Step 5: Deploy based on environment
console.log(`📤 Deploying to ${environment}...`);
switch (environment) {
  case 'development':
    console.log('ℹ️  Development deployment - Local only');
    break;
  case 'staging':
    console.log('ℹ️  Staging deployment - Configure your staging server');
    // Add staging deployment logic here
    break;
  case 'production':
    console.log('ℹ️  Production deployment - Configure your production server');
    // Add production deployment logic here
    break;
}
console.log('✅ Deployment completed\n');

console.log('🎉 Deployment process complete!\n');
console.log(`Environment: ${environment}`);
console.log(`Version: ${manifest.version}`);
console.log(`Commit: ${manifest.commitHash}`);

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}
