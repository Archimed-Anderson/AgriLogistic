/* eslint-disable no-console */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const DUMMY_ENV = {
  R2_ACCOUNT_ID: 'dummy',
  R2_ACCESS_KEY: 'dummy',
  R2_SECRET_KEY: 'dummy',
  R2_BUCKET_NAME: 'dummy',
  SLACK_WEBHOOK_URL: 'http://dummy',
  PAGERDUTY_ROUTING_KEY: 'dummy',
  SENTRY_DSN: 'http://dummy',
  OPENWEATHERMAP_API_KEY: 'dummy',
  ELASTICSEARCH_USERNAME: 'elastic',
  ELASTICSEARCH_PASSWORD: 'changeme',
};

const VALIDATORS = [
  'validate-config.js',
  'validate-prompt2.js',
  'validate-prompt3.js',
  'validate-prompt4.js',
  'validate-prompt5.js',
  'validate-prompt6.js',
  'validate-prompt7.js',
  'validate-prompt8.js'
];

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting Global Validation (Prompts 1 - Final)...\n');

let totalPassed = 0;
let totalFailed = 0;

for (const script of VALIDATORS) {
  const scriptPath = path.join(SCRIPTS_DIR, script);
  if (!fs.existsSync(scriptPath)) {
    console.log(`\x1b[33m[SKIP] Missing script: ${script}\x1b[0m`);
    continue;
  }

  console.log(`\x1b[34m>> Running ${script}...\x1b[0m`);
  try {
    execSync(`node "${scriptPath}"`, { 
      stdio: 'inherit',
      env: { ...process.env, ...DUMMY_ENV }
    });
    console.log(`\x1b[32m[PASS] ${script}\x1b[0m\n`);
    totalPassed++;
  } catch (err) {
    console.log(`\x1b[31m[FAIL] ${script}\x1b[0m\n`);
    totalFailed++;
  }
}

console.log('---------------------------------------------------');
console.log(`\x1b[36mGlobal Validation Summary:\x1b[0m`);
console.log(`\x1b[32mPassed: ${totalPassed}\x1b[0m`);
if (totalFailed > 0) {
  console.log(`\x1b[31mFailed: ${totalFailed}\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✅ All Prompts Validated. System is Ready.\x1b[0m`);
  process.exit(0);
}
