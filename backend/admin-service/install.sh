#!/bin/bash

# Admin Service Installation Script

echo "🚀 Installing Admin Service Dependencies..."

# Navigate to admin-service directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "ℹ️  .env file already exists"
fi

# Type check
echo "🔍 Running type check..."
npm run typecheck

if [ $? -eq 0 ]; then
    echo "✅ Type check passed!"
else
    echo "⚠️  Type check failed. Please fix TypeScript errors."
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Start the service with: npm run dev"
echo "3. Or use Docker: docker-compose up -d"
echo ""
