# =============================================================================
# Linkerd2 - Installation CLI (Windows) - Cahier Service Mesh
# =============================================================================
# Installe le CLI Linkerd pour pouvoir exécuter linkerd check, linkerd install, etc.
# Le control plane s'installe sur le cluster via : linkerd install | kubectl apply -f -
# =============================================================================
$ErrorActionPreference = "Stop"
$LINKERD_VERSION = if ($env:LINKERD_VERSION) { $env:LINKERD_VERSION } else { "stable-2.15" }
$InstallDir = Join-Path $env:USERPROFILE ".linkerd2\bin"
$TarPath = Join-Path $env:TEMP "linkerd2-cli.tar.gz"

Write-Host "=== Linkerd CLI (Windows) - $LINKERD_VERSION ===" -ForegroundColor Cyan

if (Get-Command linkerd -ErrorAction SilentlyContinue) {
    Write-Host "Linkerd CLI déjà présent : $(linkerd version --client --short 2>$null)"
    exit 0
}

$Arch = if ($env:PROCESSOR_ARCHITECTURE -eq "AMD64") { "amd64" } else { "386" }
$Url = "https://github.com/linkerd/linkerd2/releases/download/$LINKERD_VERSION/linkerd2-cli-$LINKERD_VERSION-windows-$Arch"
if ($LINKERD_VERSION -match "stable") {
    $Url = "https://github.com/linkerd/linkerd2/releases/latest/download/linkerd2-cli-$($LINKERD_VERSION)-windows-$Arch"
}
Write-Host "Téléchargement : $Url"
try {
    Invoke-WebRequest -Uri $Url -OutFile (Join-Path $env:TEMP "linkerd.exe") -UseBasicParsing
} catch {
    Write-Host "Erreur téléchargement. Téléchargez manuellement : https://github.com/linkerd/linkerd2/releases" -ForegroundColor Yellow
    exit 1
}

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
Move-Item -Path (Join-Path $env:TEMP "linkerd.exe") -Destination (Join-Path $InstallDir "linkerd.exe") -Force
$Env:PATH = "$InstallDir;$Env:PATH"
[Environment]::SetEnvironmentVariable("PATH", "$InstallDir;$([Environment]::GetEnvironmentVariable('PATH','User'))", "User")
Write-Host "CLI installé dans : $InstallDir" -ForegroundColor Green
Write-Host "Redémarrez le terminal ou exécutez : `$Env:PATH = `"$InstallDir;`$Env:PATH`"" -ForegroundColor Yellow
Write-Host "Puis : linkerd check --pre ; linkerd install --crds | kubectl apply -f - ; linkerd install | kubectl apply -f -" -ForegroundColor Yellow
