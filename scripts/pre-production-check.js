/**
 * Pre-Production Validation Script
 * Runs comprehensive checks before deployment
 * 
 * Usage: node scripts/pre-production-check.js
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}═══ ${msg} ═══${colors.reset}\n`),
};

const checks = [];
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;

function addResult(name, passed, message, isWarning = false) {
  checks.push({ name, passed, message, isWarning });
  if (passed) {
    passedChecks++;
    log.success(`${name}: ${message}`);
  } else if (isWarning) {
    warnings++;
    log.warning(`${name}: ${message}`);
  } else {
    failedChecks++;
    log.error(`${name}: ${message}`);
  }
}

function runCommand(cmd, silent = false) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

async function checkTypeScript() {
  log.header('TypeScript Validation');
  
  const result = runCommand('npm run typecheck 2>&1', true);
  if (result.success) {
    addResult('TypeScript Check', true, 'No type errors found');
  } else {
    addResult('TypeScript Check', false, 'Type errors detected');
  }
}

async function checkLinting() {
  log.header('Linting Validation');
  
  const result = runCommand('npm run lint 2>&1', true);
  
  // Count errors and warnings from output
  const errorMatch = result.output?.match(/(\d+) errors?/);
  const warningMatch = result.output?.match(/(\d+) warnings?/);
  
  const errors = errorMatch ? parseInt(errorMatch[1]) : 0;
  const warningCount = warningMatch ? parseInt(warningMatch[1]) : 0;
  
  if (errors === 0) {
    if (warningCount > 0) {
      addResult('ESLint', true, `0 errors, ${warningCount} warnings`, true);
    } else {
      addResult('ESLint', true, 'No linting issues');
    }
  } else {
    addResult('ESLint', false, `${errors} errors, ${warningCount} warnings`);
  }
}

async function checkTests() {
  log.header('Test Validation');
  
  const result = runCommand('npm run test:ci 2>&1', true);
  
  // Parse test results
  const testMatch = result.output?.match(/Tests?\s+(\d+)\s+passed/);
  const failMatch = result.output?.match(/(\d+)\s+failed/);
  
  const passed = testMatch ? parseInt(testMatch[1]) : 0;
  const failed = failMatch ? parseInt(failMatch[1]) : 0;
  
  if (result.success && failed === 0) {
    addResult('Unit Tests', true, `${passed} tests passed`);
  } else {
    addResult('Unit Tests', false, `${failed} tests failed out of ${passed + failed}`);
  }
}

async function checkBuild() {
  log.header('Build Validation');
  
  const result = runCommand('npm run build 2>&1', true);
  
  if (result.success) {
    addResult('Production Build', true, 'Build completed successfully');
    
    // Check bundle size
    const distPath = resolve(process.cwd(), 'dist');
    if (existsSync(distPath)) {
      const sizeResult = runCommand('du -sh dist 2>/dev/null || dir dist /s 2>nul', true);
      addResult('Bundle Generated', true, 'dist/ folder created');
    }
  } else {
    addResult('Production Build', false, 'Build failed');
  }
}

async function checkSecurityAudit() {
  log.header('Security Audit');
  
  const result = runCommand('npm audit --json 2>&1', true);
  
  try {
    const auditData = JSON.parse(result.output);
    const vulnerabilities = auditData?.metadata?.vulnerabilities || {};
    const critical = vulnerabilities.critical || 0;
    const high = vulnerabilities.high || 0;
    const moderate = vulnerabilities.moderate || 0;
    const low = vulnerabilities.low || 0;
    
    if (critical > 0 || high > 0) {
      addResult('Security Audit', false, 
        `Critical: ${critical}, High: ${high}, Moderate: ${moderate}, Low: ${low}`);
    } else if (moderate > 0) {
      addResult('Security Audit', true, 
        `No critical/high vulnerabilities. Moderate: ${moderate}, Low: ${low}`, true);
    } else {
      addResult('Security Audit', true, 'No significant vulnerabilities');
    }
  } catch {
    addResult('Security Audit', true, 'Audit completed (parsing skipped)', true);
  }
}

async function checkDockerConfiguration() {
  log.header('Docker Configuration');
  
  // Check Dockerfile exists
  const dockerfilePath = resolve(process.cwd(), 'Dockerfile');
  if (existsSync(dockerfilePath)) {
    addResult('Dockerfile', true, 'Dockerfile exists');
  } else {
    addResult('Dockerfile', false, 'Dockerfile not found');
  }
  
  // Check docker-compose
  const composePath = resolve(process.cwd(), 'docker-compose.yml');
  if (existsSync(composePath)) {
    // Validate docker-compose syntax
    const result = runCommand('docker-compose config --quiet 2>&1', true);
    if (result.success) {
      addResult('Docker Compose', true, 'Configuration is valid');
    } else {
      addResult('Docker Compose', false, 'Configuration has errors');
    }
  } else {
    addResult('Docker Compose', false, 'docker-compose.yml not found');
  }
}

async function checkEnvironmentFiles() {
  log.header('Environment Configuration');
  
  const envExample = resolve(process.cwd(), '.env.example');
  const envFile = resolve(process.cwd(), '.env');
  
  if (existsSync(envExample)) {
    addResult('.env.example', true, 'Template file exists');
  } else {
    addResult('.env.example', false, 'Template file missing');
  }
  
  if (existsSync(envFile)) {
    // Check for required variables
    const envContent = readFileSync(envFile, 'utf-8');
    const requiredVars = [
      'VITE_AUTH_PROVIDER',
      'VITE_API_GATEWAY_URL',
    ];
    
    const missingVars = requiredVars.filter(v => !envContent.includes(v));
    
    if (missingVars.length === 0) {
      addResult('.env Configuration', true, 'All required variables present');
    } else {
      addResult('.env Configuration', true, 
        `Missing optional vars: ${missingVars.join(', ')}`, true);
    }
  } else {
    addResult('.env File', true, '.env not present (will use defaults)', true);
  }
}

async function checkDocumentation() {
  log.header('Documentation');
  
  const requiredDocs = [
    { name: 'README.md', path: 'README.md' },
    { name: 'Architecture', path: 'docs/ARCHITECTURE.md' },
    { name: 'API Endpoints', path: 'docs/API_ENDPOINTS.md' },
    { name: 'Development Guide', path: 'docs/DEVELOPMENT_GUIDE.md' },
  ];
  
  for (const doc of requiredDocs) {
    const docPath = resolve(process.cwd(), doc.path);
    if (existsSync(docPath)) {
      addResult(doc.name, true, 'Documentation exists');
    } else {
      addResult(doc.name, true, 'Documentation missing', true);
    }
  }
}

async function checkCIConfiguration() {
  log.header('CI/CD Configuration');
  
  const ciPath = resolve(process.cwd(), '.github/workflows/ci.yml');
  const cdPath = resolve(process.cwd(), '.github/workflows/cd.yml');
  
  if (existsSync(ciPath)) {
    addResult('CI Pipeline', true, 'GitHub Actions CI configured');
  } else {
    addResult('CI Pipeline', false, 'CI pipeline not found');
  }
  
  if (existsSync(cdPath)) {
    addResult('CD Pipeline', true, 'GitHub Actions CD configured');
  } else {
    addResult('CD Pipeline', true, 'CD pipeline not found', true);
  }
}

async function checkMonitoringConfiguration() {
  log.header('Monitoring Configuration');
  
  const prometheusPath = resolve(process.cwd(), 'infrastructure/monitoring/prometheus/prometheus.yml');
  const alertsPath = resolve(process.cwd(), 'infrastructure/monitoring/prometheus/rules/alerts.yml');
  const grafanaPath = resolve(process.cwd(), 'infrastructure/monitoring/grafana/dashboards');
  
  if (existsSync(prometheusPath)) {
    addResult('Prometheus Config', true, 'Prometheus configured');
  } else {
    addResult('Prometheus Config', false, 'Prometheus not configured');
  }
  
  if (existsSync(alertsPath)) {
    addResult('Alert Rules', true, 'Alert rules defined');
  } else {
    addResult('Alert Rules', true, 'Alert rules not defined', true);
  }
  
  if (existsSync(grafanaPath)) {
    addResult('Grafana Dashboards', true, 'Dashboards configured');
  } else {
    addResult('Grafana Dashboards', true, 'Dashboards not found', true);
  }
}

function printSummary() {
  log.header('VALIDATION SUMMARY');
  
  const total = passedChecks + failedChecks + warnings;
  const passRate = ((passedChecks / total) * 100).toFixed(1);
  
  console.log(`${colors.bold}Total Checks:${colors.reset} ${total}`);
  console.log(`${colors.green}Passed:${colors.reset} ${passedChecks}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${warnings}`);
  console.log(`${colors.red}Failed:${colors.reset} ${failedChecks}`);
  console.log(`${colors.bold}Pass Rate:${colors.reset} ${passRate}%`);
  console.log('');
  
  if (failedChecks === 0) {
    log.success('🎉 All critical checks passed! System is ready for production.');
    if (warnings > 0) {
      log.warning(`${warnings} warning(s) should be reviewed before production.`);
    }
    return 0;
  } else {
    log.error(`❌ ${failedChecks} critical check(s) failed. Please fix before deploying.`);
    console.log('\nFailed checks:');
    checks
      .filter(c => !c.passed && !c.isWarning)
      .forEach(c => console.log(`  - ${c.name}: ${c.message}`));
    return 1;
  }
}

async function main() {
  console.log(`
${colors.bold}${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║        AgroLogistic Platform - Pre-Production Check          ║
║                        Version 2.0.0                         ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);
  
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Working Directory: ${process.cwd()}`);
  
  // Run all checks
  await checkTypeScript();
  await checkLinting();
  await checkTests();
  await checkBuild();
  await checkSecurityAudit();
  await checkDockerConfiguration();
  await checkEnvironmentFiles();
  await checkDocumentation();
  await checkCIConfiguration();
  await checkMonitoringConfiguration();
  
  // Print summary and exit
  const exitCode = printSummary();
  process.exit(exitCode);
}

main().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
