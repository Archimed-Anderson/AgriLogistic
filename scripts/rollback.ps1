# 🔙 Emergency Rollback Protocol (PowerShell)
# Reverts the last commit and force pushes to origin to trigger a redeploy of the previous version.

Write-Host "⚠️  INITIATING EMERGENCY ROLLBACK..." -ForegroundColor Red
Write-Host "This will revert the latest commit immediately. Use only in critical failure scenarios."
$confirm = Read-Host "Are you absolutely sure you want to revert HEAD? (y/N)"

if ($confirm -ne "y") {
    Write-Host "Rollback cancelled."
    exit 1
}

# 1. Create revert commit
git revert HEAD --no-edit

# 2. Push to trigger CI/CD pipeline for the revert
git push origin main

Write-Host "✅ Rollback commit pushed successfully. Monitor CI/CD status for deployment." -ForegroundColor Green
