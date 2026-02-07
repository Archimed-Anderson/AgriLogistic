const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
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

function runCommand(cmd, cwd) {
    try {
        log(`Running: ${cmd} in ${cwd}`, COLORS.cyan);
        execSync(cmd, { cwd, stdio: 'inherit' }); 
        return true;
    } catch (error) {
        log(`[FAIL] Command failed: ${cmd}`, COLORS.red);
        return false;
    }
}

async function validatePrompt6() {
  log('Starting Validation for PROMPT 6: Bouclier de Qualité (Tests & CI/CD)\n', COLORS.cyan);

  let passed = true;

  // 1. Check CI Pipeline
  passed &= checkFileExists(path.join(PROJECT_ROOT, '.github/workflows/ci.yml'), 'CI Workflow');
  passed &= checkFileContent(path.join(PROJECT_ROOT, '.github/workflows/ci.yml'), 'pnpm test', 'CI Workflow runs unit tests');

  // 2. Check ESLint Config
  passed &= checkFileExists(path.join(PROJECT_ROOT, '.eslintrc.js'), 'ESLint Config');
  passed &= checkFileContent(path.join(PROJECT_ROOT, '.eslintrc.js'), 'no-explicit-any', 'ESLint forbids any');
  passed &= checkFileContent(path.join(PROJECT_ROOT, '.eslintrc.js'), 'no-console', 'ESLint forbids console.log');

  // 3. Check Auth Service Tests
  const authServicePath = path.join(PROJECT_ROOT, 'services/identity/auth-service');
  passed &= checkFileExists(path.join(authServicePath, 'package.json'), 'Auth Service package.json');
  passed &= checkFileContent(path.join(authServicePath, 'package.json'), 'jest', 'Auth Service has jest');
  passed &= checkFileExists(path.join(authServicePath, 'jest.config.js'), 'Auth Service jest config');
  passed &= checkFileExists(path.join(authServicePath, 'tests/unit/auth.controller.spec.ts'), 'Auth Service Unit Tests');

  // 4. Check User Service Tests
  const userServicePath = path.join(PROJECT_ROOT, 'services/identity/user-service');
  passed &= checkFileExists(path.join(userServicePath, 'package.json'), 'User Service package.json');
  passed &= checkFileContent(path.join(userServicePath, 'package.json'), 'jest', 'User Service has jest');
  passed &= checkFileExists(path.join(userServicePath, 'jest.config.js'), 'User Service jest config');
  passed &= checkFileExists(path.join(userServicePath, 'tests/unit/users.routes.spec.ts'), 'User Service Unit Tests');

  // 5. Run Tests
  log('\nAttempting to run tests (Dependency installation might be required manualy if failed)...', COLORS.cyan);
  
  if (fs.existsSync(path.join(authServicePath, 'node_modules'))) {
       log('\nRunning Auth Service Tests...', COLORS.cyan);
      if (runCommand('pnpm test', authServicePath)) {
          log('[PASS] Auth Service Tests passed', COLORS.green);
      } else {
          log('[FAIL] Auth Service Tests failed', COLORS.red);
          passed = false;
      }
  } else {
      log('[WARN] Auth Service node_modules missing. Skipping execution tests.', COLORS.yellow);
  }

  if (fs.existsSync(path.join(userServicePath, 'node_modules'))) {
      log('\nRunning User Service Tests...', COLORS.cyan);
      if (runCommand('pnpm test', userServicePath)) { // Changed from test:jest because we updated package.json
          log('[PASS] User Service Tests passed', COLORS.green);
      } else {
          log('[FAIL] User Service Tests failed', COLORS.red);
          passed = false;
      }
  } else {
       log('[WARN] User Service node_modules missing. Skipping execution tests.', COLORS.yellow);
  }

  if (passed) {
    log('\n✅ PROMPT 6 VALIDATION SUCCEEDED', COLORS.green);
  } else {
    log('\n❌ PROMPT 6 VALIDATION FAILED', COLORS.red);
    process.exit(1);
  }
}

validatePrompt6();
