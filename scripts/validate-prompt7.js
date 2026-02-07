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

async function validatePrompt7() {
  log('Starting Validation for PROMPT 7: Observabilité Totale\n', COLORS.cyan);

  let passed = true;

  // 1. Check Logger Module
  const loggerPath = path.join(PROJECT_ROOT, 'packages/common/src/logger/pino-logger.config.ts');
  passed &= checkFileExists(loggerPath, 'Standard Logger Module');
  passed &= checkFileContent(loggerPath, 'LoggerModule.forRoot', 'Logger configuration correct');

  // 2. Check Package.json dependencies for Logger
  const commonPackagePath = path.join(PROJECT_ROOT, 'packages/common/package.json');
  passed &= checkFileContent(commonPackagePath, 'nestjs-pino', 'Dependency nestjs-pino added');

  // 3. Check Grafana Dashboard
  const dashboardPath = path.join(PROJECT_ROOT, 'infrastructure/monitoring/grafana/agrologistic_dashboard.json');
  passed &= checkFileExists(dashboardPath, 'Grafana Dashboard JSON');
  passed &= checkFileContent(dashboardPath, 'Requests Per Second', 'Dashboard contains RPS panel');

  // 4. Check Prometheus Alerts
  const alertsPath = path.join(PROJECT_ROOT, 'infrastructure/monitoring/prometheus/alert_rules.yml');
  passed &= checkFileExists(alertsPath, 'Prometheus Alert Rules');
  passed &= checkFileContent(alertsPath, 'alert: ServiceDown', 'Alert ServiceDown defined');

  // 5. Check Guide
  const guidePath = path.join(PROJECT_ROOT, 'docs/archive/PROMPT7_GUIDE.md');
  passed &= checkFileExists(guidePath, 'Integration Guide');

  if (passed) {
    log('\n✅ PROMPT 7 VALIDATION SUCCEEDED', COLORS.green);
    process.exit(0);
  } else {
    log('\n❌ PROMPT 7 VALIDATION FAILED', COLORS.red);
    process.exit(1);
  }
}

validatePrompt7();
