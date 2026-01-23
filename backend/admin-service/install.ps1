# Admin Service Installation Script (Windows)

Write-Host "🚀 Installing Admin Service Dependencies..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing npm dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "✅ .env file created. Please update it with your configuration." -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Yellow
}

# Type check
Write-Host "🔍 Running type check..." -ForegroundColor Cyan
npm run typecheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Type check passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Type check failed. Please fix TypeScript errors." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env file with your configuration"
Write-Host "2. Start the service with: npm run dev"
Write-Host "3. Or use Docker: docker-compose up -d"
Write-Host ""
