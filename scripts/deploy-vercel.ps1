# Vercel Deployment Script
# This script automates the Vercel deployment process

Write-Host "🚀 Starting Vercel Deployment..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    pnpm add -g vercel
}

# Navigate to web-app directory
Set-Location -Path "apps/web-app"

Write-Host "🔗 Linking Vercel project..." -ForegroundColor Cyan
vercel link

Write-Host "✅ Vercel project linked!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure environment variables in Vercel dashboard:" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_API_URL" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_AI_SERVICE_URL" -ForegroundColor Gray
Write-Host "   - DATABASE_URL (from Neon)" -ForegroundColor Gray
Write-Host "   - R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy to production:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Or create a preview deployment:" -ForegroundColor White
Write-Host "   vercel" -ForegroundColor Yellow
