# AgriLogistic AI Service - Quick Start Script (PowerShell)

Write-Host "🧠 Starting AgriLogistic AI Service..." -ForegroundColor Green
Write-Host ""

# Step 1: Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose not found. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker and Docker Compose found" -ForegroundColor Green
Write-Host ""

# Step 2: Create .env if not exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env file created" -ForegroundColor Green
}
else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Step 3: Start services
Write-Host "🚀 Starting services (Ollama + Qdrant + FastAPI)..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 4: Check service health
Write-Host ""
Write-Host "🔍 Checking service health..." -ForegroundColor Cyan

# Check Qdrant
try {
    $response = Invoke-WebRequest -Uri "http://localhost:6333/collections" -Method GET -TimeoutSec 5
    Write-Host "✅ Qdrant is running" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Qdrant not responding yet" -ForegroundColor Yellow
}

# Check Ollama
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5
    Write-Host "✅ Ollama is running" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Ollama not responding yet" -ForegroundColor Yellow
}

# Check FastAPI
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ FastAPI is running" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  FastAPI not responding yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📥 Pulling Ollama models..." -ForegroundColor Cyan
Write-Host "This may take 5-10 minutes depending on your internet speed..." -ForegroundColor Yellow

# Pull models
docker exec agrilogistic-ollama ollama pull glm4:9b
docker exec agrilogistic-ollama ollama pull nomic-embed-text

Write-Host ""
Write-Host "✅ Models downloaded successfully" -ForegroundColor Green

Write-Host ""
Write-Host "📚 Seeding knowledge base..." -ForegroundColor Cyan
python seed_knowledge.py

Write-Host ""
Write-Host "=" * 60 -ForegroundColor DarkGray
Write-Host "✅ AgriLogistic AI Service is ready!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor DarkGray
Write-Host ""
Write-Host "📊 Service URLs:" -ForegroundColor Cyan
Write-Host "  - FastAPI:  http://localhost:8000" -ForegroundColor White
Write-Host "  - Qdrant:   http://localhost:6333/dashboard" -ForegroundColor White
Write-Host "  - Ollama:   http://localhost:11434" -ForegroundColor White
Write-Host ""
Write-Host "📝 Try it:" -ForegroundColor Cyan
Write-Host '  curl -X POST http://localhost:8000/ai/consult \' -ForegroundColor White
Write-Host '    -H "Content-Type: application/json" \' -ForegroundColor White
Write-Host '    -d ''{"question": "Comment cultiver le maïs?"}''' -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation: README.md" -ForegroundColor Cyan
Write-Host ""
