# ==============================================================================
# Génération des clés JWT RS256 (Kong + Auth Service)
# AgroLogistic 2.0
#
# - Génère une paire RSA (privée/publique) via OpenSSL
# - Écrit:
#   - infrastructure/kong/keys/jwt-private.pem  (NE PAS COMMITER)
#   - infrastructure/kong/keys/jwt-public.pem   (OK à commiter)
# - Injecte la clé publique dans infrastructure/kong/kong.yml
#   en remplaçant le placeholder "__RSA_PUBLIC_KEY__"
# ==============================================================================

param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Fail($msg) {
  Write-Host "[ERROR] $msg" -ForegroundColor Red
  exit 1
}

function Info($msg) {
  Write-Host "[INFO] $msg" -ForegroundColor Cyan
}

function Ok($msg) {
  Write-Host "[OK] $msg" -ForegroundColor Green
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$keysDir = Join-Path $repoRoot "kong\keys"
$privateKeyPath = Join-Path $keysDir "jwt-private.pem"
$publicKeyPath  = Join-Path $keysDir "jwt-public.pem"
$kongConfigPath = Join-Path $repoRoot "kong\kong.yml"

if (-not (Test-Path $keysDir)) {
  New-Item -ItemType Directory -Path $keysDir -Force | Out-Null
}

if (((Test-Path $privateKeyPath) -or (Test-Path $publicKeyPath)) -and -not $Force) {
  Fail "Des clés existent déjà. Relance avec -Force pour régénérer."
}

if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
  Fail "OpenSSL introuvable. Installe OpenSSL (ou Git for Windows qui fournit openssl) puis relance."
}

Info "Génération de la clé privée RSA 2048 bits..."
& openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out $privateKeyPath | Out-Null
Ok "Clé privée créée: $privateKeyPath"

Info "Extraction de la clé publique..."
& openssl pkey -in $privateKeyPath -pubout -out $publicKeyPath | Out-Null
Ok "Clé publique créée: $publicKeyPath"

Info "Injection de la clé publique dans kong.yml (placeholder __RSA_PUBLIC_KEY__)..."
$kongContent = Get-Content $kongConfigPath -Raw

if ($kongContent -notmatch "__RSA_PUBLIC_KEY__") {
  Fail "Placeholder __RSA_PUBLIC_KEY__ introuvable dans $kongConfigPath. Vérifie la config."
}

$pub = (Get-Content $publicKeyPath -Raw).TrimEnd()

# Indentation attendue sous `rsa_public_key: |` dans kong.yml: 10 espaces
$indented = ($pub -split "`r?`n" | ForEach-Object { "          $_" }) -join "`r`n"

$kongContent = $kongContent -replace "__RSA_PUBLIC_KEY__", $indented

Set-Content -Path $kongConfigPath -Value $kongContent -NoNewline
Ok "kong.yml mis à jour."

Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host " - Ne commite jamais: $privateKeyPath" -ForegroundColor Yellow
Write-Host " - Configure l'auth-service avec JWT_PRIVATE_KEY_PATH=$privateKeyPath et JWT_PUBLIC_KEY_PATH=$publicKeyPath (ou via volumes/env dans Docker)." -ForegroundColor Yellow

