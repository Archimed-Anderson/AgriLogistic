#!/bin/bash

# AgriLogistic AI Service - Quick Start Script

echo "🧠 Starting AgriLogistic AI Service..."
echo ""

# Step 1: Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found"
echo ""

# Step 2: Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi
echo ""

# Step 3: Start services
echo "🚀 Starting services (Ollama + Qdrant + FastAPI)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Step 4: Check service health
echo ""
echo "🔍 Checking service health..."

# Check Qdrant
if curl -s http://localhost:6333/collections > /dev/null; then
    echo "✅ Qdrant is running"
else
    echo "⚠️  Qdrant not responding yet"
fi

# Check Ollama
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama not responding yet"
fi

# Check FastAPI
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ FastAPI is running"
else
    echo "⚠️  FastAPI not responding yet"
fi

echo ""
echo "📥 Pulling Ollama models..."
echo "This may take 5-10 minutes depending on your internet speed..."

# Pull models
docker exec agrilogistic-ollama ollama pull glm4:9b
docker exec agrilogistic-ollama ollama pull nomic-embed-text

echo ""
echo "✅ Models downloaded successfully"

echo ""
echo "📚 Seeding knowledge base..."
python3 seed_knowledge.py

echo ""
echo "=" * 60
echo "✅ AgriLogistic AI Service is ready!"
echo "=" * 60
echo ""
echo "📊 Service URLs:"
echo "  - FastAPI:  http://localhost:8000"
echo "  - Qdrant:   http://localhost:6333/dashboard"
echo "  - Ollama:   http://localhost:11434"
echo ""
echo "📝 Try it:"
echo '  curl -X POST http://localhost:8000/ai/consult \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"question": "Comment cultiver le maïs?"}'"'"
echo ""
echo "📖 Documentation: README.md"
echo ""
