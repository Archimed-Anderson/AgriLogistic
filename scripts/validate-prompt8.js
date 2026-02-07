const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(msg, color = COLORS.reset) {
  console.log(`${color}${msg}${COLORS.reset}`);
}

function checkFileExists(filePath, desc) {
  if (fs.existsSync(filePath)) {
    log(`[PASS] ${desc} exists: ${filePath}`, COLORS.green);
    return true;
  } else {
    log(`[FAIL] ${desc} missing: ${filePath}`, COLORS.red);
    return false;
  }
}

function checkFileContent(filePath, contentCheck, desc) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(contentCheck)) {
    log(`[PASS] ${desc} contains expected content`, COLORS.green);
    return true;
  } else {
    log(`[FAIL] ${desc} missing expected content: "${contentCheck}"`, COLORS.red);
    return false;
  }
}

async function validatePrompt8() {
  log('Starting Validation for PROMPT 8: Documentation Vivante (Swagger)\n', COLORS.cyan);

  let passed = true;

  // 1. Check Swagger Config Helper
  const swaggerConfigPath = path.join(PROJECT_ROOT, 'packages/common/src/swagger/swagger.config.ts');
  passed &= checkFileExists(swaggerConfigPath, 'Swagger Config Helper');
  passed &= checkFileContent(swaggerConfigPath, 'DocumentBuilder', 'Config uses DocumentBuilder');

  // 2. Check Package.json dependencies
  const commonPackagePath = path.join(PROJECT_ROOT, 'packages/common/package.json');
  passed &= checkFileContent(commonPackagePath, '@nestjs/swagger', 'Dependency @nestjs/swagger added');
  passed &= checkFileContent(commonPackagePath, 'swagger-ui-express', 'Dependency swagger-ui-express added');

  // 3. Check Guide
  const guidePath = path.join(PROJECT_ROOT, 'docs/archive/PROMPT8_GUIDE.md');
  passed &= checkFileExists(guidePath, 'Integration Guide');

  if (passed) {
    log('\n✅ PROMPT 8 VALIDATION SUCCEEDED', COLORS.green);
    process.exit(0);
  } else {
    log('\n❌ PROMPT 8 VALIDATION FAILED', COLORS.red);
    process.exit(1);
  }
}

validatePrompt8();
