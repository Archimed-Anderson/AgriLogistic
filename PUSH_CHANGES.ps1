# AgriLogistic - Git Workflow Helper
# Ce script facilite le push vers GitHub avec un message formaté

param (
    [Parameter(Mandatory = $true)]
    [string]$Message
)

Write-Host "--- 🌾 AgriLogistic Sync Workflow ---" -ForegroundColor Green

# 1. Vérification du statut
Write-Host "[1/3] Indexation des fichiers..." -ForegroundColor Cyan
git add .

# 2. Commit
Write-Host "[2/3] Création du commit : $Message" -ForegroundColor Cyan
git commit -m "$Message"

# 3. Push
Write-Host "[3/3] Envoi vers GitHub (main)..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Succès ! Votre code est à jour sur GitHub." -ForegroundColor Green
}
else {
    Write-Host "`n❌ Erreur lors du push. Vérifiez votre connexion ou votre token." -ForegroundColor Red
}
