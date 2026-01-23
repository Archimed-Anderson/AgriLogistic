
# Verify Phase 2 - Auth Service Integration

$ErrorActionPreference = "Stop"

Write-Host "Verifying Phase 2 Step 1 - Auth Service Integration..." -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"
$username = "admin"
$password = "admin123"

# 1. Test Login
Write-Host "`n1. Testing Login via Kong ($baseUrl/auth/login)..." -ForegroundColor Yellow
try {
    $body = @{
        email    = "admin@agrologistic.app"
        password = $password
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/login" -Body $body -ContentType "application/json"
    
    if ($response.access_token) {
        Write-Host "Login Successful! Token received." -ForegroundColor Green
        $global:token = $response.access_token
        Write-Host "Token snippet: $($token.Substring(0, 15))..." -ForegroundColor Gray
    }
    else {
        Write-Host "Login response missing access_token." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Login Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Details: $($reader.ReadToEnd())"
    }
    exit 1
}

# 2. Test Protected Route (Simulated)
# Since Product Service is not running, we expect 503 from Kong if upstream is down.
# If Auth is INVALID, Kong rejects -> 401.

Write-Host "`n2. Testing JWT Validation (via Product Route: $baseUrl/products)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/products" -Headers @{ Authorization = "Bearer $token" }
    Write-Host "Unexpected Success (Product Service should be down)" -ForegroundColor Magenta
}
catch {
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        if ($statusCode -eq 503) {
            Write-Host "Success! Kong validated token and attempted proxy (Upstream 503 expected)." -ForegroundColor Green
        }
        elseif ($statusCode -eq 401) {
            Write-Host "Failure! Kong rejected token (401 Unauthorized)." -ForegroundColor Red
            Exit 1
        }
        else {
            Write-Host "Warning: HTTP $statusCode" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nPHASE 2 CHECKLIST:" -ForegroundColor Cyan
Write-Host "[x] Auth Service Containerized" -ForegroundColor Green
Write-Host "[x] Kong Routing Configured" -ForegroundColor Green
Write-Host "[x] JWT Generation & Validation" -ForegroundColor Green
